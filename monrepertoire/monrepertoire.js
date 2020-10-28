/*
	Mon Répertoire
	
	Permet de réviser son répertoire d'Anglais
	
	UI:
		* lbRepertoire: (select) permet de sélectionner un fichier de répertoire
	
	
	Fichier de répertoire: 
		* Contient:
			* natif: langue native
			* etranger: langue étrangère (exemple: en-EN)
*/

/*
	Lire un texte
*/
function lireTexte(texte, langue) {
	var synth = window.speechSynthesis;

	var ttsUtter = new SpeechSynthesisUtterance(texte);
	if (langue === "E")
	{
		ttsUtter.voice = voixEtrangere;
	} else {
		ttsUtter.voice = voixNative;
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

/*
 Charge les mots
 
 C'est une liste d'objets de la structure suivante:
  * nom: nom d'affichage
  * liste: liste de mots
 Exemple:
	repertoire = {
		natif: "fr-FR",
		etranger: "Anglais"
		invariables: { "nom": "Mots invariables", "liste": ["le","la","les"]},
   	adjectifs: { "nom": "Adjectifs", "liste": ["beau","laid"]}
 	 }
*/
function chargerRepertoire(noRepertoire)
{
	if (repertoire != null) {
		dialog("Erreur: un répertoire est déjà chargé");
	}
	if (noRepertoire == -1) {
		repertoire = null; 
		return;
	}
	//if (url == null) return;
	
	// $.getJSON("url", function(json) {
		// if (json.etranger === undefined) throw "Erreur de format: il manque le code langue étrangère"
		// if (json.mots === undefined) throw "Erreur de format: il manque les mots";
		
		// $('#mots > thead').html('<tr><th>Français</th><th>Anglais</th></tr>'); 
		// var body = $('#mots > tbody');
		// body.html('');
		// for (var mot in json.mots)
		// {
			// body.append('<tr><td>'+mot.natif+'</td><td>'+mot.etranger+'</td>');
		// }
	// });
	var rep = repertoires[noRepertoire];
	
	if (rep.etranger === undefined) throw "Erreur de format: il manque le code langue étrangère"
	if (rep.mots === undefined) throw "Erreur de format: il manque les mots";
	
	// recherche une voix native
	if (window.speechSynthesis != null)
	{
		var voices =  window.speechSynthesis.getVoices();
		
		var meilleurRang = 10000;
		for (var i in voices)
		{
			var voice = voices[i];
			if (voice.lang === rep.codeNatif)
			{
				voixNative = voice;
				break;
			}
			var rang = rep.codeNatif.indexOf(voice.lang);
			if ((rang != -1) && (rang < meilleurRang))
			{
				voixNative = voice;
				meilleurRang = rang;
			}
		}

		meilleurRang = 10000;
		for (var i in voices)
		{
			var voice = voices[i];
			if (voice.lang === rep.codeEtranger)
			{
				voixEtrangere = voice;
				break;
			}
			var rang = rep.codeEtranger.indexOf(voice.lang);
			if ((rang != -1) && (rang < meilleurRang))
			{
				voixEtrangere = voice;
				meilleurRang = rang;
			}
		}
		if (voixNative == null)
		{
			alert("Pas de voix trouvée pour la langue "+rep.natif);
		}
		if (voixEtrangere == null) 
		{
			alert("Pas de voix trouvée pour la langue "+rep.etranger);
		}
	}
	$('#mots > thead').html('<tr><th class="lisible" data-langue="N">Français</th><th class="lisible" data-langue="E">Anglais</th></tr>'); 
	var body = $('#mots > tbody');
	body.html('');
	for (var noMot in rep.mots)
	{
		var mot = rep.mots[noMot];
		body.append('<tr><td class="lisible" data-langue="N">'+mot.natif+'</td><td class="lisible" data-langue="E">'+mot.etranger+'</td></tr>');
	}
	
	// prêt à travailler
	$("#frmPreparation").show();

}

/* Charger un script différé */
var include = function(url, callback){
 
    /* on crée une balise<script type="text/javascript"></script> */
    var script = document.createElement('script');
    script.type = 'text/javascript';
 
    /* On fait pointer la balise sur le script qu'on veut charger
       avec en prime un timestamp pour éviter les problèmes de cache
    */
 
    script.src = url; // + '?' + (new Date().getTime());
 
    /* On dit d'exécuter cette fonction une fois que le script est chargé */
    if (callback) {
        script.onreadystatechange = callback;
        script.onload = script.onreadystatechange;
    }
 
    /* On rajoute la balise script dans le head, ce qui démarre le téléchargement */
    document.getElementsByTagName('head')[0].appendChild(script);
}

// Le répertoire chargé
repertoires=[];
//chargerRepertoire('monrepertoire/anglais.json');
include('monrepertoire/anglais.js', function() {
	var sel = $('#selRepertoire');
	sel.html('');
	sel.append($('<option>', {  value: -1, text: '' }));
	for (var i in repertoires) {
		var rep = repertoires[i];
		sel.append($('<option>', {  value: i, text: rep.nom }));
	}
	sel.change();
});

const speech = window.speechSynthesis;
var repertoire=null;
var voixNative=null;
var voixEtrangere=null;

$(document).ready(function() {
	// Déclenche le chargement des voix...
	if(speech.onvoiceschanged !== undefined)
	{
		speech.onvoiceschanged = () => syntheseDemarree();
	}
	function syntheseDemarree()
	{
		var voices = speech.getVoices(); // now should have an array of all voices
		for (var i in voices)
		{
			$('#selVoice').append("<option>"+voices[i].name+"</option>");
		}
		$('#loader').remove();	
	}
	
	
	//
	// Tout commence par la sélection d'un répertoire
	//
	$('#selRepertoire').on("change", function() {
		chargerRepertoire($(this).val());
	});
	

	// La class "lisible" permet de lire un texte
	//  - on sélectionne la langue par data-langue="N" (natif) ou data-langue="E" (étrangère, selon le répertoire ouvert)
	//  - on indique le texte à lire par data-lecture, sinon le texte affiché sera utilisé
	$("body").on("click", ".lisible", function() {
		var langue = $(this).data("langue");
		var texte = $(this).data("lecture");
		if ((texte === undefined) || (texte=="")) texte = $(this).text();
		lireTexte(texte, langue);
	});
	
	
	//
	// Affiche ou masque les parties
	//
	$("#frmPreparation").hide();
	$("#frmDictee").hide();
	$("#frmCorrection").hide();

});