var triviaQuestions = [];

// Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
var queryURL = "https://opentdb.com/api.php?amount=5&category=17&difficulty=easy&type=multiple"
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {

    //get response.results.[].correct_answer&incorrect_answer and assign it to answer List  in a random array
    for(var i=0; i < response.results.length; i++){
        var result = response.results[i]
        var triviaQuestion = {
        question: result.question
        } 

        var answers = result.incorrect_answers;
        var correctAnswer = result.correct_answer;
        var correctAnswerIndex = Math.floor(Math.random()*4)

        answers.splice(correctAnswerIndex,0,correctAnswer);

        triviaQuestion.answerList = answers;
        triviaQuestion.answer = correctAnswerIndex;

        triviaQuestions.push(triviaQuestion);
    }
    
    
    

  

});


function randomImage(tag){

var queryURL =  "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + tag + "&1";
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
        //parameter "response" will return data from the api and console.log it to make sure it's working and look at maping for the images
        var imageUrl = response.data.image_original_url;

        var gifImage = $("<img>");
        gifImage.attr("src", imageUrl);
        gifImage.attr("class", "img-fluid")
        gifImage.attr("alt", "gif image");
        $("#gif").prepend(gifImage);
  
  console.log(response);

});
}

var currentQuestion;
var correctAnswer;
var incorrectAnswer;
var unanswered;
var seconds;
var time;
var answered;
var userSelect;

var messages = {
    correct: "Yup, you got it!",
    incorrect: "Nope, that's wrong!",
    endTime: "Too bad, times up!",
    finished: "And you're score is...."

}

//press start to load the game
//page loads with a start button
$('#startBtn').on('click', function(){
	$(this).hide();
	newGame();
});


//start new game after first 5 questions
$('#startOverBtn').on('click', function(){
    $(this).hide();
    newGame();
});








function newGame(){
    $('#finalMessage').empty();
    $('#correctAnswers').empty();
    $('#incorrectAnswers').empty();
    $('#unanswered').empty();
    currentQuestion = 0;
    correctAnswer = 0;
    incorrectAnswer = 0;
    unanswered = 0;
    newQuestion();
}

function newQuestion(){
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();
	answered = true;
	
	//sets up new questions & answerList
	$('#currentQuestion').html('Question #'+(currentQuestion+1)+'/'+triviaQuestions.length);
	$('.question').html('<h2>' + triviaQuestions[currentQuestion].question + '</h2>');
	for(var i = 0; i < 4; i++){
		var choices = $('<div>');
		choices.text(triviaQuestions[currentQuestion].answerList[i]);
		choices.attr({'data-index': i });
		choices.addClass('thisChoice');
		$('.answerList').append(choices);
    }
    
    //a 30 second timmer is ticking down for each question not the entire game
	countdown();
	
	$('.thisChoice').on('click',function(){
		userSelect = $(this).data('index');
		clearInterval(time);
		answerPage();
	});
}

function countdown(){
	seconds = 30;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	answered = true;
	//sets timer to go down
	time = setInterval(showCountdown, 1000);
}

function showCountdown(){
	seconds--;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	if(seconds < 1){
		clearInterval(time);
		answered = false;
		answerPage();
	}
}
//clicking an answer will pause the time and setup answerPage
function answerPage(){
    $('#currentQuestion').empty();
    $('.thisChoice').empty();
    $('.question').empty();

    var correctAnswerText = triviaQuestions[currentQuestion].answerList[triviaQuestions[currentQuestion].answer];
    var correctAnswerIndex = triviaQuestions[currentQuestion].answer;
    

    if((userSelect === correctAnswerIndex) && (answered === true)){
        correctAnswer++;
        $('#message').html(messages.correct);
        randomImage("applause");

    }else if((userSelect !== correctAnswerIndex)&&(answered === true)){ 
        incorrectAnswer++;
        $('#message').html(messages.incorrect);
        $('#correctedAnswer').html('The correct answer is: '+ correctAnswerText);
        randomImage("sad");
    }else{ 
        unanswered++;
        $('#message').html(messages.endTime);
        $('#correctedAnswer').html('The correct answer is: ' + correctAnswerText);
        answered = true;
        randomImage("shrug");
    }

if(currentQuestion==(triviaQuestions.length-1)){
    setTimeout(scoreboard, 5000)
}else{
    currentQuestion++;
    setTimeout(newQuestion,5000);
}
}

function scoreboard(){
    $('#timeLeft').empty();
    $('#message').empty();
    $('#corretedAnswers').empty();
    $('#gif').empty();
    

    $('#finalmessage').html(messages.finished);
    $('#correctAnswers').html('Correct Answers: ' + correctAnswer);
    $('#incorrectAnswers').html('Incorrect Answers: ' + incorrectAnswer);
    $('#unanswered').html('Unanswered: ' + unanswered);
    $('#startOverBtn').addClass('reset');
    $('#startOverBtn').show();
    $('#startOverBtn').html('Start Over?');
    
}



//one question is shown at a time (https://opentdb.com/api.php?amount=20&category=17&difficulty=easy&type=multiple)

//4 possbile answers , answers are highlighted as the cursor is hovering.

//when user clicks an answer, if it's correct and celebratory gif appears 

//when uswer clicks an answer but its incorrect the correct answer is displayed and a bummer gif appears. 

//if no user click the timmer runs down, then  a gif appears and a message of "out of time!" 

//a delay of 5 seconds, then automatically the next question appears on the screen.  

//End of game : message of "All done, here's how you did!" with correct answers, incorrect answers, unanswered and an option to start over



