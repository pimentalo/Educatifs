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


// Affiche une coche verte ou une croix rouge sur les mots selon qu'ils soient justes ou faux.
//
//
function corrigerDictee() {
	$("#frmPreparation").hide();
	//$("#frmDictee").hide();
	$("#frmCorrection").show();
	
	//
	var nbok = 0;
	var nbmots = 0;
	$('#frmDictee input').each(function() {
		nbmots++;
		var reponse=$(this).data('reponse').toLowerCase();
		if ($(this).val().toLowerCase()==reponse) 
		{
			nbok++;
			$(this).next().prepend('<span class="input-group-text bg-success">'+reponse+'<i class="fa fa-check-circle"></span>');
		} else {
			$(this).next().prepend('<span class="input-group-text bg-error"><b>'+reponse+'</b><i class="fa fa-skull-crossbones bg-error"></span>');
//			$("<span class='btn btn-error'><i class='fa fa-skull-crossbones'></i></span>").insertAfter(this);
		}
	});
	$("#corrige").text("Note : "+nbok+"/"+nbmots);
}


$(document).ready(function() {
	//
	// Afficher les voix disponibles
	//
	var synth = window.speechSynthesis;	
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

	$("body").on("click", ".lisible", function() {
		var texte = $(this).data("lecture");
		if ((texte === undefined) || (texte=="")) texte = $(this).text();
		lireTexte(texte);
	});
	
	//
	// Charge les mots
	// C'est une liste d'objets de la structure suivante:
	//  * nom: nom d'affichage
	//  * liste: liste de mots
	// Exemple:
	//   { 
	//		invariables: { "nom": "Mots invariables", "liste": ["le","la","les"]},
	//   	adjectifs: { "nom": "Adjectifs", "liste": ["beau","laid"]}
	// 	 }
	var listeMots = $('#listeMots');
	var mots = $.getJSON("js/mots.json", function(json) {
		for (var k in json) {
			var m = json[k];
			var option = document.createElement('option');
			option.textContent = m.nom;
			option.setAttribute('data-name', m.nom);
			option.setAttribute('value', m.liste);
			listeMots.append(option);
		}
	
		//$(listeMots).children('option[selected="selected"]').removeAttr('selected');
		//$(listeMots).children('option:first').attr('selected','selected');	
	
		$(listeMots).trigger('change');
	});
	// Gérer le changement de liste de mots
	// On affiche la liste des mots dans un <li> qui contient:
	// un "span" avec le mot à écrire
	// un inputbox avec la réponse
	// un bouton pour lire le mot
	var modelePrep = "<li class='list-inline-item col-xs-12 col-sm-6 col-md-4 lisible' data-lecture='mot'><span class='btn'>mot</span><i class='fa fa-volume-up float-right'></i></li>";
	var modeleDictee = "<div class='input-group col-xs-12 col-md-6'><input class='form-control lisible' type='text' data-reponse='mot' data-lecture='mot'></input><div class='input-group-append'><i class='fa fa-volume-up'></i></div></div>";
	$(listeMots).on("change", function() {
		$('#motsPrep').html('');
		$('#dictee').html('');

		var mots1 = $(this).val();
		if (mots1 == null) return;
		
		var mots = mots1.split(",");
		for (var k in mots) {
			$('#motsPrep').append(modelePrep.replace(/mot/gi, mots[k]));
			$('#dictee').append(modeleDictee.replace(/mot/gi, mots[k]));
		}
	});
	//$(listeMots).trigger("change");
	
	//
	// Affiche ou masque les parties
	//
	$("#frmPreparation").show();
	$("#frmDictee").hide();
	$("#frmCorrection").hide();

});