
var GameContainer = document.getElementById('container');

var TopHeader = React.createClass({
    render: function(){
        return (
            <h3>Nine - Simple Game on React JS</h3>
        );
    }
});

var StarsFrame = React.createClass({
    render: function () {
        var starsNums = this.props.numsOfStars;
        var stars = [];
        for (i=0; i < starsNums; i++) {
            stars.push(
                <span className="glyphicon glyphicon-star"></span>
            );
        };

        return (
            <div className="col-sm-5 well stars">
                {stars}
            </div>
        );
    }
});

var BtnFrame = React.createClass({
    render: function () {
        var disabled = (this.props.selectedNumbers.length === 0),
            button,
            correct = this.props.correct;

        switch (correct) {
            case true:
                button = (
                    <button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
                        <span className="glyphicon glyphicon-ok"></span>
                    </button>
                );
                break;
            case false:
                button = (
                    <button className="btn btn-danger btn-lg">
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                );
                break;
            default:
                button = (
                    <button className="btn btn-primary btn-lg" onClick={this.props.checkAnswer} disabled={disabled} > = </button>
                );
                break;
        };

        return (
            <div className="col-sm-2 ans-button">
                {button}
            </div>
        );
    }
});

var AnsFrame = React.createClass({
    render: function () {

        var props = this.props;

        var selectedNumbers = props.selectedNumbers.map(function(i){
            return (
                <span
                    onClick={props.unselectNumber.bind(null, i)}
                >{i}</span>
            );

        });

        return (
            <div className="col-sm-5 well answers">
                {selectedNumbers}
            </div>
        );
    }
});

var BottomNumsFrame = React.createClass({
    render: function () {
        var numbers = [],
            usedNumbers = this.props.usedNumbers,
            className,
            SelectNumber =  this.props.SelectNumber,
            selectedNumbers = this.props.selectedNumbers;

        for (i = 1; i <= 9; i++) {
            className = "number selected-" + (selectedNumbers.indexOf(i)>=0);
            className += " used-"+ (usedNumbers.indexOf(i)>=0);
            numbers.push(
                <span
                    className={className}
                    onClick={SelectNumber.bind(null, i)}
                >{i}
                </span>
            );
        };

        return (
            <div className="col-sm-12 well nums">
                {numbers}
            </div>
        );
    }
});

var Game = React.createClass({

    getInitialState: function(){
        return {
            numsOfStars: Math.floor(Math.random()*9)+1,
            selectedNumbers: [],
            correct: null,
            usedNumbers: []
        };
    },

    SelectNumber: function(clickedNumber){
        if(this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
            this.setState({
                selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
                correct: null
            });
        }
    },

    unselectNumber: function(clickedNumber){
        var selectedNumbers = this.state.selectedNumbers,
            indexOfNumber = selectedNumbers.indexOf(clickedNumber);

        selectedNumbers.splice(indexOfNumber, 1);

        this.setState({
            selectedNumbers: selectedNumbers,
            correct: null
        });

    },

    sumOfSelectedNumbers: function(){
        var sum = this.state.selectedNumbers.reduce(function(p,n){
            return p+n;
        }, 0);
        return sum;
    },

    checkAnswer: function(){
        var correct = (this.state.numsOfStars === this.sumOfSelectedNumbers());
        this.setState({correct: correct});
    },

    acceptAnswer: function(){
        var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);

        this.setState({
            selectedNumbers: [],
            usedNumbers: usedNumbers,
            correct: null,
            numsOfStars: Math.floor(Math.random()*9)+1
        });
    },

    render: function () {
        var selectedNumber = this.state.selectedNumbers,
            numsOfStars = this.state.numsOfStars,
            correct = this.state.correct,
            usedNumbers = this.state.usedNumbers;

        return (
            <div>
                <TopHeader />
                <StarsFrame numsOfStars={numsOfStars} />
                <BtnFrame
                    selectedNumbers={selectedNumber}
                    correct={correct}
                    checkAnswer={this.checkAnswer}
                    acceptAnswer={this.acceptAnswer}
                />
                <AnsFrame selectedNumbers={selectedNumber}
                          unselectNumber={this.unselectNumber}/>
                <BottomNumsFrame
                    selectedNumbers={selectedNumber}
                    SelectNumber={this.SelectNumber}
                    usedNumbers={usedNumbers}
                />
            </div>
        );
    }
});

React.render(<Game />, GameContainer);