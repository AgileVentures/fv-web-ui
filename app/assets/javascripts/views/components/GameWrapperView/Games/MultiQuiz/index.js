var React = require('react');
var PubSub = require('pubsub-js');

var _ = require('underscore');

var classNames = require('classnames');
var Mui = require('material-ui');

var {
      IconButton, RaisedButton, LinearProgress, Snackbar
    } = Mui;

var ThemeManager = new Mui.Styles.ThemeManager();

var WordOperations = require('operations/WordOperations');

var Answer = require('./Answer');

var loadingComponent = <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">Loading...</div>;

class MultiQuiz extends React.Component {

  constructor(props) {
    super(props);

    this.eventName = this.constructor.name.toUpperCase();

    // Theme changes
    this.linearProgressStyle = {height: '15px', marginBottom: '10px'};

    ThemeManager.setComponentThemes({
      snackbar: {
        actionColor: '#ffffff'
      }
    });

    this.handleNavigate = this.handleNavigate.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.displayAnswers = this.displayAnswers.bind(this);

    this.totalQuestion = 10;

    this.state = {
      word: props.word,
      questions: [],
      displayedAnswers: [],
      selectedAnswers:[],
      checkedAnswers:[],
      currentAnswer: null,
      currentAnswerIndex: 0,
      correctAnswerMedia: loadingComponent
    };

    // TODO: Combine into one single query or nicer chaining
    WordOperations.getWordsByLangauge(props.client, props.language, "(dc:subjects LIKE '%" + props.category + "')").then((function(words){

      words = _.sample(words, this.totalQuestion);

      this.setState({
        questions: words,
        currentAnswer: words[this.state.currentAnswerIndex]
      });

      PubSub.publish( this.eventName + ":DATALOADED" );

    }).bind(this));

    // Subscribers
    PubSub.subscribe( 'ANSWER:SELECTED', this.handleAnswerSelected );
    PubSub.subscribe( this.eventName + ':DATALOADED', this.displayAnswers );
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  displayAnswers(selectedAnswerKey = null) {

    var selected = false;
    var tmpAnswers = [];
    var incorrectAnswers = _.without(_.shuffle(this.state.questions), this.state.currentAnswer);

    // If question being displayed for the first time
    if (!(this.state.currentAnswerIndex in this.state.displayedAnswers)) {
      if (incorrectAnswers.length != 0 ) {
        tmpAnswers.push(<Answer key={this.state.questions[this.state.currentAnswerIndex].uid} client={this.props.client} selected={selected} data={this.state.questions[this.state.currentAnswerIndex]} correct="true" />);

        for (var i=0; i < 3; i++) {
          tmpAnswers.push(<Answer key={incorrectAnswers[i].uid} client={this.props.client} selected={selected} data={incorrectAnswers[i]} correct="false" />);
        }

        var arrayvar = this.state.displayedAnswers.slice();
        var newelement = _.shuffle(tmpAnswers);
        arrayvar[this.state.currentAnswerIndex] = newelement;

        this.setState({displayedAnswers: arrayvar});
      }
    }
    // Question already displayed, and answer specificed
    else if (selectedAnswerKey != null) {

      var arrayvar = this.state.displayedAnswers.slice();

      _.each(this.state.displayedAnswers[this.state.currentAnswerIndex], function(element, index, list){

        var selected = false;

        if (element.key === selectedAnswerKey) {
          selected = true;
        }

        tmpAnswers.push(React.cloneElement(element, { selected: selected }));
      });

      arrayvar[this.state.currentAnswerIndex] = tmpAnswers;

      this.setState({displayedAnswers: arrayvar});
    }
  }

  handleAnswerSelected( msg, data ){
    var arrayvar = this.state.selectedAnswers.slice();
    arrayvar[this.state.currentAnswerIndex] = data;

    this.setState({selectedAnswers: arrayvar});

    // Re-render answers
    this.displayAnswers(data);
  }

  checkAnswer() {

    var correct = false;

    // Build utility for this...
    var arrayvar = this.state.checkedAnswers.slice();

    if (this.state.selectedAnswers[this.state.currentAnswerIndex] == this.state.currentAnswer.uid) {
      correct = true;
    }

    arrayvar[this.state.currentAnswerIndex] = correct;
    this.setState({checkedAnswers: arrayvar});

    this.refs.feedback.show();
  }

  handleNavigate(direction) {

    var newIndex;

    if (direction == 'next')
      newIndex = this.state.currentAnswerIndex + 1;
    else
      newIndex = this.state.currentAnswerIndex - 1;

    if (newIndex <= (this.totalQuestion - 1) && newIndex >= 0)
    {
      this.setState({
        currentAnswer: this.state.questions[newIndex],
        currentAnswerIndex: newIndex,
        correctAnswerMedia: loadingComponent
      });

      WordOperations.getMediaByWord(this.props.client, this.state.questions[newIndex].uid, "(ecm:primaryType='Picture')").then((function(correctAnswerMedia){
        WordOperations.getMediaBlobById(this.props.client, correctAnswerMedia[0].uid, correctAnswerMedia[0].properties['file:content']['mime-type']).then((function(response){
          this.setState({
            correctAnswerMedia: <div className="imgCont"><img className="image" src={response.dataUri} alt=""/></div>
          });

          this.displayAnswers();

        }).bind(this));
      }).bind(this));
    }
  }

  render() {

    return <div className="multiquiz-container">
      <div className="row">
        <div className="col-xs-12">
          <LinearProgress style={this.linearProgressStyle} mode="determinate" value={((this.state.currentAnswerIndex + 1) / this.totalQuestion) * 100} />
        </div>
      </div>      
      <div className="row">
        <div className={classNames('col-xs-12', 'text-center')}>
          <hr />
          {(this.state.currentAnswer != null) ? <h2>{this.state.currentAnswer.title}</h2> : loadingComponent}
        </div>
      </div>
      <div context="test" className={classNames('row', 'row-answers')}>
        {this.state.displayedAnswers[this.state.currentAnswerIndex]}
      </div>
      <div className={classNames('row', 'row-navigation')}>
        <div className={classNames('col-xs-2', 'text-left')}>
          <IconButton onTouchTap={this.handleNavigate.bind(this, 'previous')} iconClassName={classNames('glyphicon', 'glyphicon-chevron-left')} tooltip="Previous Question"/>
        </div>
        <div className={classNames('col-xs-8', 'text-center')}>
          <div><RaisedButton secondary={true} disabled={(this.state.currentAnswerIndex in this.state.selectedAnswers) ? false : true} onTouchTap={this.checkAnswer.bind(this)} label="Check Answer" /></div>
          <Snackbar ref="feedback" style={(this.state.checkedAnswers[this.state.currentAnswerIndex] === true) ? {backgroundColor: 'green'} : {}} message={(this.state.checkedAnswers[this.state.currentAnswerIndex] === true) ? 'Great job!' : 'Try Again...'} action="close" autoHideDuration={1500} />
        </div>
        <div className={classNames('col-xs-2', 'text-right')}>
          <IconButton onTouchTap={this.handleNavigate.bind(this, 'next')} iconClassName={classNames('glyphicon', 'glyphicon-chevron-right')} tooltip="Next Question"/>
        </div>
      </div>
    </div>;
  }
}

MultiQuiz.contextTypes = {
  muiTheme: React.PropTypes.object,
  router: React.PropTypes.func
};

MultiQuiz.childContextTypes = {
  muiTheme: React.PropTypes.object
};


module.exports = MultiQuiz;