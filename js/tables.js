function initCalcul() {
	var op1 = Math.floor(2 + 0 * Math.random());
	var op2 = Math.floor(1 + 9 * Math.random());

	$('#reponse').text("");
	
	$('#op1').text(op1);
	$('#op2').text(op2);
	
	toPlay = [];
	toPlay.push(audio[op1]);
	toPlay.push(audio[0]);
	toPlay.push(audio[op2]);
	//playSequence();

}

var noResultat=0;
var score = 0;
var heureDebut = 0;
var heureFin = 0;

var audio = new Array(10);
var toPlay = [];

function playSequence() {
	if (toPlay.length > 0) {
		var sound = toPlay.pop();
		sound.play();
	}
}


$(document).ready(
	function() {
		audio[0]=new Audio("media/fois.m4a");
		audio[1]=new Audio("media/1.m4a");
		audio[2]=new Audio("media/2.m4a");
		audio[3]=new Audio("media/3.m4a");
		audio[4]=new Audio("media/4.m4a");
		audio[5]=new Audio("media/5.m4a");
		audio[6]=new Audio("media/6.m4a");
		audio[7]=new Audio("media/7.m4a");
		audio[8]=new Audio("media/8.m4a");
		audio[9]=new Audio("media/9.m4a");
		
		audio.forEach(function(a) 
			{
				a.addEventListener('ended', playSequence);
			}
		)
		
		$('#score').addClass("hidden");
		$('#operation').removeClass("hidden");
		
		$('.clavier').click(function() { $('#reponse').text($('#reponse').text().concat($(this).text())); });
		$('#retour').click(function() { var val = $('#reponse').text(); val = val.substring(0, val.length - 1); $('#reponse').text(val); });
		
		heureDebut = new Date();
		$('#validation').click(function() {
			var op1 = parseInt($('#op1').text());
			var op2 = parseInt($('#op2').text());
			
			var resultat = op1*op2;
			var reponse = parseInt($('#reponse').text())
			if (noResultat < 10) {
			
				if ( (op1*op2) == reponse) {
					$('#R'+noResultat).addClass("bg-success glyphicon glyphicon-ok-circle");
					score += 1;
				} else {
					$('#R'+noResultat).addClass("bg-danger glyphicon glyphicon-remove-circle");
				}
				noResultat += 1;
				if (noResultat < 10) {
					initCalcul();
				} else {
					heureFin = new Date(); 
					$('#resultatFinal').text(""+score +"/10 en " + ((heureFin.getTime() - heureDebut.getTime()) / 1000) + " sec");
					$('#score').removeClass("hidden");
					$('#operation').addClass("hidden");
				}
			}
		});
		
		initCalcul();
	}
)