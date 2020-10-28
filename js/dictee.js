function lireTexte(texte) {
	var synth = window.speechSynthesis;

	var ttsUtter = new SpeechSynthesisUtterance(texte);
	var voiceSelect = $("#selVoice");
	var selectedOption = voiceSelect.val();

	var voices = synth.getVoices();
	for(i = 0; i < voices.length ; i++) {
		if(voices[i].name === selectedOption) {
			ttsUtter.voice = voices[i];
		}
	}
	synth.speak(ttsUtter);
}


function lireDictee() {
	var synth = window.speechSynthesis;
	var texte = $("#texte").text();
	var ttsUtter = new SpeechSynthesisUtterance(texte);
	var voiceSelect = $("#selVoice");
	var selectedOption = voiceSelect.val();

	var voices = synth.getVoices();
	for(i = 0; i < voices.length ; i++) {
		if(voices[i].name === selectedOption) {
			ttsUtter.voice = voices[i];
		}
	}
	synth.speak(ttsUtter);
}

function faireDictee() {
	$("#frmPreparation").hide();
	$("#frmDictee").show();
	$("#frmCorrection").hide();
}

function corrigerDictee() {
	$("#frmPreparation").hide();
	$("#frmDictee").hide();
	$("#frmCorrection").show();
	
	var reponse = "";
}


$(document).ready(function() {
	var synth = window.speechSynthesis;
	
	var inputForm = document.querySelector('form');
	var inputTxt = document.querySelector('input');
	var voiceSelect = $("#selVoice");

	var voices = synth.getVoices();

	for(i = 0; i < voices.length ; i++) {
	  var option = document.createElement('option');
	  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
	  option.setAttribute('data-lang', voices[i].lang);
	  option.setAttribute('data-name', voices[i].name);
	  option.setAttribute('value', voices[i].name);
	  voiceSelect.append(option);
	}

	$(".lisible").on("click", function() {
		lireTexte($(this).text());
	});

	inputForm.onsubmit = function(event) {
	  event.preventDefault();

	  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
	  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
	  for(i = 0; i < voices.length ; i++) {
		if(voices[i].name === selectedOption) {
		  utterThis.voice = voices[i];
		}
	  }
	  synth.speak(utterThis);
	  inputTxt.blur();
	}
	$("#frmPreparation").show();
	$("#frmDictee").hide();
	$("#frmCorrection").hide();
	
});