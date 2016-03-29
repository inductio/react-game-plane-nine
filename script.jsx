
var GameContainer = document.getElementById('container');


var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
        var combinationSum = 0;
        for (var j=0 ; j < listSize ; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

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
        for (var i=0; i < starsNums; i++) {
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
            correct = this.props.correct,
            button;

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
                    <button className="btn btn-primary btn-lg"
                            onClick={this.props.checkAnswer}
                            disabled={disabled} >=</button>
                );
        };

        return (
            <div className="col-sm-2 ans-button">
                {button}
                <br/><br/>
                <button className="btn btn-warning btn-xs"
                        onClick={this.props.reDraw}
                        disabled={this.props.redraws === 0}
                >
                    <span className="glyphicon glyphicon-refresh"></span>
                    &nbsp;
                    {this.props.redraws}
                </button>
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

var NumsFrame = React.createClass({
    render: function () {
        var numbers = [],
            className,
            usedNumbers = this.props.usedNumbers,
            SelectNumber =  this.props.SelectNumber,
            selectedNumbers = this.props.selectedNumbers;

        for (var i = 0; i <= 9; i++) {
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

var DoneFrame = React.createClass({
    render: function () {
        return (
            <div className="col-sm-12 well">
                <h2>{this.props.doneStatus}</h2>
                <button className="btn btn-primary"
                        onClick={this.props.resetGame}
                >Play again
                </button>
            </div>
        );
    }
});

var Game = React.createClass({

    getInitialState: function(){
        return {
            numsOfStars: this.randomNumber(),
            selectedNumbers: [],
            correct: null,
            usedNumbers: [],
            redraws: 5,
            doneStatus: null
        };
    },
    resetGame: function () {
        this.replaceState(this.getInitialState());
    },
    randomNumber: function(){
         return Math.floor(Math.random()*9)+1;
    },

    SelectNumber: function(clickedNumber){
        if (this.state.selectedNumbers.indexOf(clickedNumber) < 0
             && this.state.usedNumbers.indexOf(clickedNumber) < 0)
        {
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
            selectedNumbers: selectedNumbers
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
            numsOfStars: this.randomNumber()
        }, function(){
            this.updateDoneStatus()
        });
    },

    reDraw: function(){
        var redraws = this.state.redraws;
        if(redraws>0) {
            this.setState({
                selectedNumbers: [],
                correct: null,
                numsOfStars: this.randomNumber(),
                redraws: redraws - 1
            }, function(){
                this.updateDoneStatus()
            });
        }
    },

    possibleSolutions: function () {
        var numsOfStars = this.state.numsOfStars,
            possibleNumbers = [],
            usedNumbers = this.state.usedNumbers;
        for (var i=1; i<=9; i++) {
            if(usedNumbers.indexOf(i)<0) {
                possibleNumbers.push(i);
            }
        };

        return possibleCombinationSum(possibleNumbers,numsOfStars);
    },

    updateDoneStatus: function () {
        var usedNums = this.state.usedNumbers;
        if(usedNums.length === 9){
            this.setState({
                doneStatus: "Done. Nice!"
            });
            return;
        };

        if(this.state.redraws === 0 && !this.possibleSolutions(usedNums)){
            this.setState({
                doneStatus: "Game Over!"
            });
            return;
        };
    },

    render: function () {
        var selectedNumber = this.state.selectedNumbers,
            numsOfStars = this.state.numsOfStars,
            correct = this.state.correct,
            usedNumbers = this.state.usedNumbers,
            redraws = this.state.redraws,
            doneStatus = this.state.doneStatus,
            bottomFrame;

        if(doneStatus){
            bottomFrame = <DoneFrame
                doneStatus={doneStatus}
                resetGame={this.resetGame} />
        } else {
            bottomFrame = <NumsFrame
                selectedNumbers={selectedNumber}
                SelectNumber={this.SelectNumber}
                usedNumbers={usedNumbers} />
        }

        return (
            <div>
                <TopHeader />
                <StarsFrame numsOfStars={numsOfStars} />
                <BtnFrame
                    selectedNumbers={selectedNumber}
                    correct={correct}
                    redraws={redraws}
                    checkAnswer={this.checkAnswer}
                    acceptAnswer={this.acceptAnswer}
                    reDraw={this.reDraw}
                />
                <AnsFrame selectedNumbers={selectedNumber}
                          unselectNumber={this.unselectNumber}/>
                {bottomFrame}
            </div>
        );
    }
});

React.render(<Game />, GameContainer);