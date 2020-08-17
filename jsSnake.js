//Variable initialisation canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var imageFond = new Image();

//Variables d'initialisation
var vitesse = 2;      //On regle de combien de pixel on se deplace par boucle - DOIT ETRE UN MULTIPLE DE 2
var tempsRafraichissement = 10;     //Le temps de rafraichiseement du setInterval en ms
var Compteur = 3;     //Pour nous permettre de creer un nom de variable dynamique pour le tableau Historique. on commence a 3 car 1 et 2 sont pris pour les morceaux de depart: langue et tete
var MeilleurScoreClassique = 0;
var RatioScoreBattle = 0;
var NbFourmiWinBattle = 32;     //Le nombre de fourmis qu'il faut bouffer pour gagner en mode battle (-2 pour la langue et la tete)

//Variables du snake
var dx = vitesse;     //Le snake bouge vers la droite au depart
var dy = 0;           //Il reste sur l'axe des abscisses
var tailleSegmentSnake = 12;    //Taille - DOIT ETRE UN MULTIPLE DE 2
var couleurSnake = "yellow";       //Couleur
var couleurTete = "black";
var tableauSnake = [];          //Tableau dans lequel on stocke tous les morceaux du snake

var espacementMorceaux = 2;     //Nombre d'espace entre chaque morceau de snake - DOIT ETRE UN MULTIPLE DE 2

//Variables du snake PC
var dx = -vitesse;     //Le snake bouge vers la gauche au depart
var dy = 0;
var couleurSnakePC = "black";
var tableauSnakePC = [];
var CompteurPC = 3;

//Variables calcul AI
var distanceFourmi1 = 0;
var distanceFourmi2 = 0;
var fourmiSuivante = 0;

//Variables fourmis - Positionnement
var tableauFourmis = [];

//Variables decors
var xVagues = 0;
var yVagues = 0;
var directionVagues = "baisse";
var xTornade = - 200;
var yTornade = 50;
var dxTornade = 0.5;
var dyTornade = 0.5;


//Variables element DOM
//var divScores = document.getElementById("divScores");
var divRecommencer = document.getElementById("divRecommencer");
var divMenuPrincipal = document.getElementById("divMenuPrincipal");
var divOverlay = document.getElementById("divOverlay");
var divTypeJeuxClassique = document.getElementById("divTypeJeuxClassique");
var divTypeJeuxBattle = document.getElementById("divTypeJeuxBattle");
var divTypeSerpentVipere = document.getElementById("divTypeSerpentVipere");
var divTypeSerpentConstricteur = document.getElementById("divTypeSerpentConstricteur");
var divCouleurSable = document.getElementById("divCouleurSable");
var divCouleurJungle = document.getElementById("divCouleurJungle");
var divCouleurEau = document.getElementById("divCouleurEau");
var divGirls = document.getElementById("divGirls");
var divFacile = document.getElementById("divFacile");
var divMoyen = document.getElementById("divMoyen");
var divDifficile = document.getElementById("divDifficile");
var divMeilleurScore = document.getElementById("divMeilleurScore");
var divReinitScores = document.getElementById("divReinitScores");
var divAffichageDifficulte = document.getElementById("divAffichageDifficulte");
var divScoreChange = document.getElementsByClassName("divScoreChange");
var divScoreChangePC = document.getElementsByClassName("divScoreChangePC");

var choixTypeJeux = '';  //Permettra de savoir quel type de jeux on a choisi
var choixTypeSerpent = ''; //Permettra de savoir quel type de serpent on a choisi
var choixCouleurSerpent = ''; //Permettra de savoir quel couleur de serpent on a choisi
var choixDifficulte = ''; //Permettra de savoir quel difficulte on a choisi


//Objet Fourmi
function Fourmi(x, y) {
    this.xFourmi = x;
    this.yFourmi = y;
}

//Objet morceau de Snake
function MorceauSnake(x, y, width, height, dx, dy, historique, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.historique = historique;
    this.color = color;
}

//Objet historique qui fera parti de chaque morceau de snake pour connaitre les positions des elements precedents
function Historique(xHistorique, yHistorique, dxHistorique, dyHistorique){
    this.xHistorique = xHistorique;
    this.yHistorique = yHistorique;
    this.dxHistorique = dxHistorique;
    this.dyHistorique = dyHistorique;
}

//Fonction random pour choisir un entier
function rand(min, max, integer) {

    if (!integer) {
        return Math.random() * (max - min) + min;
    } else {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

//Fonction permettant de creer un cookie
function setCookie(sName, sValue) {
        var today = new Date(), expires = new Date();
        expires.setTime(today.getTime() + (365*24*60*60*1000));
        document.cookie = sName + "=" + sValue + ";expires=" + expires.toGMTString();
        
        console.log(document.cookie);
}

//Fonction permettant de tester l'existance d'un cookie
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    //dans la variable begin on a l'index de la ou commence notre nom de cookie
    var begin = dc.indexOf("; " + prefix);
    //Si on ne trouve pas de cookie
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

//Fonction permettant de recuperer la valeur du meilleur score enregistree dans le cookie - vraiment tire par les cheuveux pour afficher respectivement mes 2 cookies
function getMeilleurScore (nomCookie){
    
    var valeurMeilleurScore = '';
    var indexCookie;
    
    if (nomCookie == 'classique'){
        
        indexCookie = document.cookie.indexOf("MeilleurScoreSnakeClassique");
        indexCookie = indexCookie + 28;
        
         while (true){
             
             valeurMeilleurScore = valeurMeilleurScore + document.cookie[indexCookie];
             indexCookie = indexCookie + 1;
             
             if((document.cookie[indexCookie] == ';') || (document.cookie[indexCookie] == ' ') || (indexCookie == document.cookie.length)) {
                 break;
             }
         }
        return parseInt(valeurMeilleurScore);
    }
    
    if (nomCookie == 'battle'){
        
        indexCookie = document.cookie.indexOf("MeilleurScoreSnakeBattle");
        indexCookie = indexCookie + 25;
        
         while (true){
             
             valeurMeilleurScore = valeurMeilleurScore + document.cookie[indexCookie];
             indexCookie = indexCookie + 1;
             
             if((document.cookie[indexCookie] == ';') || (document.cookie[indexCookie] == ' ') || (indexCookie == document.cookie.length)) {
                 break;
             }
         }
        return valeurMeilleurScore;
    }
    else{
        document.cookie[indexCookie];
    }
    
}

function afficherScore (choixTypeJeux){
    if(choixTypeJeux == 'battle'){
        
        divScoreChange[0].textContent = "Score: " + (tableauSnake.length - 2);
        divScoreChangePC[0].textContent = "Score PC: " + (tableauSnakePC.length - 2);
    }
    else{
        divScoreChange[0].textContent = "Score: " + (tableauSnake.length - 2);
        divScoreChangePC[0].textContent = "";
    }
}

//Cette fonction permet de rafraichir le code CSS apres qu'une animation ait ete joue. Autrement elle ne peut etre joue qu'une seule fois - Je ne comprends rien de ce code que j'ai pompe ici: https://developer.mozilla.org/fr/docs/Web/CSS/Animations_CSS/Conseils
function refreshAnimation() {
    document.querySelector(".divScoreChange").className = "divScoreChange";
    window.requestAnimationFrame(function(time) {
        window.requestAnimationFrame(function(time) {
            document.querySelector(".divScoreChange").className = "divScoreChange changing";
        });
    });
}

function scoreBattle (resultat){
    var ValeurCookieBattle = '';
    var MeilleurScoreBattle = getMeilleurScore('battle');
    var indexSlash = MeilleurScoreBattle.indexOf('/');
    var partiesGagnees = MeilleurScoreBattle.substr(0, indexSlash);
    var partiesPerdues = MeilleurScoreBattle.substr(indexSlash + 1)
    partiesGagnees = parseInt(partiesGagnees);
    partiesPerdues = parseInt(partiesPerdues);

    if(resultat == 'gagne'){
        partiesGagnees = partiesGagnees + 1;
    }
    else if(resultat == 'perd'){
        partiesPerdues = partiesPerdues + 1;
    }
    
    if(partiesGagnees == 0){
        RatioScoreBattle = 0;
    }
    else if(partiesPerdues == 0){
        RatioScoreBattle = 1;
    }
    else{
        RatioScoreBattle = partiesGagnees / (partiesPerdues + partiesGagnees);
        //On arrondi a 2 chiffres apres la virgule
        RatioScoreBattle = Number((RatioScoreBattle).toFixed(2)); 
    }
    
    ValeurCookieBattle = partiesGagnees + '/' + partiesPerdues;
    setCookie("MeilleurScoreSnakeBattle", ValeurCookieBattle);

    console.log(partiesGagnees);
    console.log(partiesPerdues);
    console.log(ValeurCookieBattle);
    console.log(RatioScoreBattle);
    return RatioScoreBattle;
}

//Cette fonction permet de re-initialiser les parametres du snake pour recommencer une partie a 0 avec les parametres de base
function relancerSnake () {
    dx = vitesse;     
    dy = 0;
    tableauSnake = [];

    tableauFourmis = [];
    Compteur = 3;

    //Appel de la fonction pour initialiser notre premier morceau de snake
    CreerMorceauSnakeInit(200, 200, tailleSegmentSnake, tailleSegmentSnake, dx, dy, 1, couleurSnake);
    CreerMorceauSnakeInit(200 - tailleSegmentSnake, 200, tailleSegmentSnake, tailleSegmentSnake, dx, dy, 2, couleurSnake);
    
    AfficherLangue(0);
    AfficherTete(1);
   
    CreerFourmis();
    CreerFourmis();
    AfficherFourmis ();
    
    
    if(choixTypeJeux == "classique"){
        if(!getCookie("MeilleurScoreSnakeClassique")){
            setCookie("MeilleurScoreSnakeClassique", "0");
            divMeilleurScore.innerHTML = 'Meilleur score: ' + getMeilleurScore('classique');
        }
        else{
            console.log("jai deja des cookies");
            divMeilleurScore.innerHTML = 'Meilleur score: ' + getMeilleurScore('classique');
        }
    }
    
    if(choixTypeJeux == "battle"){
        if(!getCookie("MeilleurScoreSnakeBattle")){
            setCookie("MeilleurScoreSnakeBattle", "0/0");
            divMeilleurScore.innerHTML = 'Meilleur score: ' + getMeilleurScore('battle');
        }
        else{
            divMeilleurScore.innerHTML = 'Victoires / Defaites: ' + getMeilleurScore('battle');
        }
    }
}

//PC
function relancerSnakePC () {
    dx = -vitesse;     
    dy = 0;
    tableauSnakePC = [];

    CompteurPC = 3;

    //Appel de la fonction pour initialiser notre premier morceau de snake
    CreerMorceauSnakeInitPC(200, 100, tailleSegmentSnake, tailleSegmentSnake, dx, dy, 1, couleurSnakePC);
    CreerMorceauSnakeInitPC(200 + tailleSegmentSnake, 100, tailleSegmentSnake, tailleSegmentSnake, dx, dy, 2, couleurSnakePC);
    
    AfficherLanguePC(0);
    AfficherTetePC(1);
    
    //divMeilleurScore.innerHTML = 'Victoires / Defaites: ' + getMeilleurScore('battle');

    //intervalSnake = setInterval(AnimerSnake, tempsRafraichissement);
}

//Fonction pour creer un nouveau morceau de Snake lors des tests SANS bouffer de fourmi
function CreerMorceauSnakeInit (x, y, width, height, dx, dy, TailleTableauSnake, color) {
    
    window['Tab'+ TailleTableauSnake] = [];
    console.log("valeur de la taille du tableau envoyee: ", TailleTableauSnake);
    //On instancie un nouveau morceau de snake
    
    console.log("nom de la valiable dynamique: ", window['Tab'+TailleTableauSnake]);
    var morceauSnake = new MorceauSnake(x, y, width, height, dx, dy, window['Tab'+TailleTableauSnake], color);
    //On place notre nouveau morceau de snake dans le tableau
    tableauSnake.push(morceauSnake);
}
//PC
//Fonction pour creer un nouveau morceau de Snake lors des tests SANS bouffer de fourmi
function CreerMorceauSnakeInitPC (x, y, width, height, dx, dy, TailleTableauSnake, color) {
    
    window['Tab'+ TailleTableauSnake] = [];
    //On instancie un nouveau morceau de snake
    
    var morceauSnake = new MorceauSnake(x, y, width, height, dx, dy, window['Tab'+TailleTableauSnake], color);
    //On place notre nouveau morceau de snake dans le tableau
    tableauSnakePC.push(morceauSnake);
}


//Fonction pour creer un nouveau morceau de Snake en bouffant une fourmis
function CreerMorceauSnake (x, y, width, height, dx, dy, historique, color) {
    
    Compteur = Compteur +1;
    
    //On prepare un tableau vide pour etre passe en parametre de la creation de morceau. Ce tableau contiendra plus tard les objets historiques
    window['Tab'+ Compteur] = [];
    
    //On instancie un nouveau morceau de snake
    var morceauSnake = new MorceauSnake(x, y, width, height, dx, dy, window['Tab'+ Compteur], color);
    
    //On place notre nouveau morceau de snake dans le tableau
    tableauSnake.push(morceauSnake);
}
//PC
//Fonction pour creer un nouveau morceau de Snake en bouffant une fourmis
function CreerMorceauSnakePC (x, y, width, height, dx, dy, historique, color) {
    
    CompteurPC = CompteurPC +1;
    
    //On prepare un tableau vide pour etre passe en parametre de la creation de morceau. Ce tableau contiendra plus tard les objets historiques
    window['Tab'+ CompteurPC] = [];
    
    //On instancie un nouveau morceau de snake
    var morceauSnake = new MorceauSnake(x, y, width, height, dx, dy, window['Tab'+ CompteurPC], color);
    
    //On place notre nouveau morceau de snake dans le tableau
    tableauSnakePC.push(morceauSnake);
}

//Fonction pour afficher un morceau de snake
function AfficherMorceauSnake(indexTableau){
    //La couleur de notre snake
    context.fillStyle = tableauSnake[indexTableau].color;
    //Le placement de notre snake
    context.fillRect(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y, tableauSnake[indexTableau].width, tableauSnake[indexTableau].height);
    
    //Pour afficher un serpent avec des espaces entre ses morceaux
    if(espacementMorceaux > 0){
        context.strokeStyle = "black";
        context.lineWidth = "0.5";
        context.strokeRect(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y, tableauSnake[indexTableau].width, tableauSnake[indexTableau].height);
    }
    //Pour afficher un serpent qui n'a pas d'espace
    else{
        //Si on va de gauche a droite ou de droite a gauche
        if((tableauSnake[indexTableau].dx > 0 && tableauSnake[indexTableau].dy === 0) || (tableauSnake[indexTableau].dx < 0 && tableauSnake[indexTableau].dy === 0)){
            context.strokeStyle = "black";
            context.lineWidth = "0.5";
            context.beginPath();
            context.moveTo(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y);  // 1er point
            context.lineTo(tableauSnake[indexTableau].x + tailleSegmentSnake, tableauSnake[indexTableau].y); // 2e point
            context.stroke();
            context.beginPath();
            context.moveTo(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y + tailleSegmentSnake);  // 1er point
            context.lineTo(tableauSnake[indexTableau].x + tailleSegmentSnake, tableauSnake[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
        }
        //Si on descend ou on monte
        else if((tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy > 0) || (tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy < 0)){
            context.strokeStyle = "black";
            context.lineWidth = "0.5";
            context.beginPath();
            context.moveTo(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y);  // 1er point
            context.lineTo(tableauSnake[indexTableau].x, tableauSnake[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
            context.beginPath();
            context.moveTo(tableauSnake[indexTableau].x + tailleSegmentSnake, tableauSnake[indexTableau].y);  // 1er point
            context.lineTo(tableauSnake[indexTableau].x + tailleSegmentSnake, tableauSnake[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
        }
    }
}
//PC
//Fonction pour afficher un morceau de snake
function AfficherMorceauSnakePC(indexTableau){
    //La couleur de notre snake
    context.fillStyle = tableauSnakePC[indexTableau].color;
    //Le placement de notre snake
    context.fillRect(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y, tableauSnakePC[indexTableau].width, tableauSnakePC[indexTableau].height);
    
    //Pour afficher un serpent avec des espaces entre ses morceaux
    if(espacementMorceaux > 0){
        context.strokeStyle = "black";
        context.lineWidth = "0.5";
        context.strokeRect(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y, tableauSnakePC[indexTableau].width, tableauSnakePC[indexTableau].height);
    }
    //Pour afficher un serpent qui n'a pas d'espace
    else{
        //Si on va de gauche a droite ou de droite a gauche
        if((tableauSnakePC[indexTableau].dx > 0 && tableauSnakePC[indexTableau].dy === 0) || (tableauSnakePC[indexTableau].dx < 0 && tableauSnakePC[indexTableau].dy === 0)){
            context.strokeStyle = "black";
            context.lineWidth = "0.5";
            context.beginPath();
            context.moveTo(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y);  // 1er point
            context.lineTo(tableauSnakePC[indexTableau].x + tailleSegmentSnake, tableauSnakePC[indexTableau].y); // 2e point
            context.stroke();
            context.beginPath();
            context.moveTo(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y + tailleSegmentSnake);  // 1er point
            context.lineTo(tableauSnakePC[indexTableau].x + tailleSegmentSnake, tableauSnakePC[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
        }
        //Si on descend ou on monte
        else if((tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy > 0) || (tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy < 0)){
            context.strokeStyle = "black";
            context.lineWidth = "0.5";
            context.beginPath();
            context.moveTo(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y);  // 1er point
            context.lineTo(tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
            context.beginPath();
            context.moveTo(tableauSnakePC[indexTableau].x + tailleSegmentSnake, tableauSnakePC[indexTableau].y);  // 1er point
            context.lineTo(tableauSnakePC[indexTableau].x + tailleSegmentSnake, tableauSnakePC[indexTableau].y + tailleSegmentSnake); // 2e point
            context.stroke();
        }
    }
}

//Fonction pour afficher la langue de snake
function AfficherLangue(indexTableau){
    
    
    var canvasLangue = document.createElement('canvas');
    canvasLangue.style.id = "canvasLangue"; 
    canvasLangue.style.height = tableauSnake[indexTableau].width;
    canvasLangue.style.width = tableauSnake[indexTableau].height;
    
    var contextLangue = canvasLangue.getContext('2d');
    
    //Si on bouge de gauche a droite
    if(tableauSnake[indexTableau].dx > 0 && tableauSnake[indexTableau].dy === 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(0, 6);  // 1er point
        contextLangue.lineTo(7, 6); // 2e point
        contextLangue.lineTo(12, 2); // 3e
        contextLangue.lineTo(7, 6); // 4e
        contextLangue.lineTo(12, 10);  // 5e
        contextLangue.stroke();
    }
    
    //Si on bouge de droite a gauche
    if(tableauSnake[indexTableau].dx < 0 && tableauSnake[indexTableau].dy === 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(12, 6);  // 1er point
        contextLangue.lineTo(7, 6); // 2e point
        contextLangue.lineTo(0, 2); // 3e
        contextLangue.lineTo(7, 6); // 4e
        contextLangue.lineTo(0, 10);  // 5e
        contextLangue.stroke();
    }
    
    //Si on monte
    if(tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy < 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(6, 12);  // 1er point
        contextLangue.lineTo(6, 7); // 2e point
        contextLangue.lineTo(2, 0); // 3e
        contextLangue.lineTo(6, 7); // 4e
        contextLangue.lineTo(10, 0);  // 5e
        contextLangue.stroke();
    }
    
    //Si on Desend
    if(tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy > 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(6, 0);  // 1er point
        contextLangue.lineTo(6, 7); // 2e point
        contextLangue.lineTo(2, 12); // 3e
        contextLangue.lineTo(6, 7); // 4e
        contextLangue.lineTo(10, 12);  // 5e
        contextLangue.stroke();
    }
    //Affichage du canvas dans le canvas
    context.drawImage(canvasLangue, tableauSnake[indexTableau].x, tableauSnake[indexTableau].y);
}

//PC
//Fonction pour afficher la langue de snake PC
function AfficherLanguePC(indexTableau){
    
    
    var canvasLangue = document.createElement('canvas');
    canvasLangue.style.id = "canvasLangue"; 
    canvasLangue.style.height = tableauSnakePC[indexTableau].width;
    canvasLangue.style.width = tableauSnakePC[indexTableau].height;
    
    var contextLangue = canvasLangue.getContext('2d');
    
    //Si on bouge de gauche a droite
    if(tableauSnakePC[indexTableau].dx > 0 && tableauSnakePC[indexTableau].dy === 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(0, 6);  // 1er point
        contextLangue.lineTo(7, 6); // 2e point
        contextLangue.lineTo(12, 2); // 3e
        contextLangue.lineTo(7, 6); // 4e
        contextLangue.lineTo(12, 10);  // 5e
        contextLangue.stroke();
    }
    
    //Si on bouge de droite a gauche
    if(tableauSnakePC[indexTableau].dx < 0 && tableauSnakePC[indexTableau].dy === 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(12, 6);  // 1er point
        contextLangue.lineTo(7, 6); // 2e point
        contextLangue.lineTo(0, 2); // 3e
        contextLangue.lineTo(7, 6); // 4e
        contextLangue.lineTo(0, 10);  // 5e
        contextLangue.stroke();
    }
    
    //Si on monte
    if(tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy < 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(6, 12);  // 1er point
        contextLangue.lineTo(6, 7); // 2e point
        contextLangue.lineTo(2, 0); // 3e
        contextLangue.lineTo(6, 7); // 4e
        contextLangue.lineTo(10, 0);  // 5e
        contextLangue.stroke();
    }
    
    //Si on Desend
    if(tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy > 0){
        contextLangue.strokeStyle = "black";
        contextLangue.beginPath();
        contextLangue.moveTo(6, 0);  // 1er point
        contextLangue.lineTo(6, 7); // 2e point
        contextLangue.lineTo(2, 12); // 3e
        contextLangue.lineTo(6, 7); // 4e
        contextLangue.lineTo(10, 12);  // 5e
        contextLangue.stroke();
    }
    //Affichage du canvas dans le canvas
    context.drawImage(canvasLangue, tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y);
}

//Fonction pour afficher la tete de snake
function AfficherTete(indexTableau){
    
    var canvasTete = document.createElement('canvas');
    canvasTete.style.id = "canvasTete"; 
    canvasTete.style.height = tableauSnake[indexTableau].width;
    canvasTete.style.width = tableauSnake[indexTableau].height;
    var contextTete = canvasTete.getContext('2d');
    
    //Si on monte
    if(tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy < 0){
        contextTete.translate(12,12);
        contextTete.rotate((-Math.PI /2));
        contextTete.translate(0,-12);
    }
    //Si on va a gauche
    if(tableauSnake[indexTableau].dx < 0 && tableauSnake[indexTableau].dy === 0){
        contextTete.translate(12,0);
        contextTete.scale(-1,1) 
    }
    //Si on desend
    if(tableauSnake[indexTableau].dx === 0 && tableauSnake[indexTableau].dy > 0){
        contextTete.translate(12,12);
        contextTete.rotate((Math.PI / 2));
        contextTete.translate(-12,0);
    }
        
    //La tete
    contextTete.fillStyle = "black";
    contextTete.beginPath(); // La bouche, un arc de cercle
    contextTete.arc(6, 6, 6, 0, Math.PI * 2); // Ici aussi
    contextTete.fill();
    
    //Un rectangle pour combler le cou
    contextTete.fillStyle = "black";
    contextTete.fillRect(0, 0, 6, 12);

    //L'oeil
    contextTete.fillStyle = "white";
    contextTete.beginPath(); // La bouche, un arc de cercle
    contextTete.arc(6, 3, 2, 0, Math.PI * 2); // Ici aussi
    contextTete.fill();
    //Affichage du canvas dans le canvas
    context.drawImage(canvasTete, tableauSnake[indexTableau].x, tableauSnake[indexTableau].y);
}

//PC
//Fonction pour afficher la tete de snake PC
function AfficherTetePC(indexTableau){
    
    var canvasTete = document.createElement('canvas');
    canvasTete.style.id = "canvasTete"; 
    canvasTete.style.height = tableauSnakePC[indexTableau].width;
    canvasTete.style.width = tableauSnakePC[indexTableau].height;
    var contextTete = canvasTete.getContext('2d');
    
    //Si on monte
    if(tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy < 0){
        contextTete.translate(12,12);
        contextTete.rotate((-Math.PI /2));
        contextTete.translate(0,-12);
    }
    //Si on va a gauche
    if(tableauSnakePC[indexTableau].dx < 0 && tableauSnakePC[indexTableau].dy === 0){
        contextTete.translate(12,0);
        contextTete.scale(-1,1) 
    }
    //Si on desend
    if(tableauSnakePC[indexTableau].dx === 0 && tableauSnakePC[indexTableau].dy > 0){
        contextTete.translate(12,12);
        contextTete.rotate((Math.PI / 2));
        contextTete.translate(-12,0);
    }
        
    //La tete
    contextTete.fillStyle = "black";
    contextTete.beginPath(); // La bouche, un arc de cercle
    contextTete.arc(6, 6, 6, 0, Math.PI * 2); // Ici aussi
    contextTete.fill();
    
    //Un rectangle pour combler le cou
    contextTete.fillStyle = "black";
    contextTete.fillRect(0, 0, 6, 12);

    //L'oeil
    contextTete.fillStyle = "white";
    contextTete.beginPath(); // La bouche, un arc de cercle
    contextTete.arc(6, 3, 2, 0, Math.PI * 2); // Ici aussi
    contextTete.fill();
    //Affichage du canvas dans le canvas
    context.drawImage(canvasTete, tableauSnakePC[indexTableau].x, tableauSnakePC[indexTableau].y);
}


function afficherCailloux(){
  
    var imageCailloux = new Image();
    var imageCailloux2 = new Image();
    imageCailloux.src = 'images/cailloux.png';
    imageCailloux2.src = 'images/cailloux2.png';
    context.drawImage(imageCailloux, 100, 50, 40, 20);
    context.drawImage(imageCailloux2, 300, 250, 40, 20);
}

function afficherSoleilCouchant(){
  
    var imagesoleilCouchant = new Image();
    imagesoleilCouchant.src = 'images/soleilCouchant.jpg';
    context.drawImage(imagesoleilCouchant, 0, 0);
}

function afficherVagues(xVagues, yVagues){
    context.drawImage(imageFond, xVagues, yVagues);  
}

function bougerVagues(){
    
    if((directionVagues == "baisse") && (yVagues <= 100)){
        yVagues = yVagues + 0.2;
    }
    if((directionVagues == "baisse") && (yVagues > 100)){
            
        setTimeout(function() {
            directionVagues = "monte"
            //yVagues = yVagues - 1;
        }, 2000);
    }
    
    if((directionVagues == "monte") && (yVagues > 0)){
        yVagues = yVagues - 0.2;
    }
    if((directionVagues == "monte") && (yVagues <= 0)){
            setTimeout(function() {
                directionVagues = "baisse"
                //yVagues = yVagues + 1;
            }, 2000);
        }
}

function afficherTornade(xTornade, yTornade){
    var imageTornade = new Image();
    imageTornade.src = 'images/tornade.png';
    context.drawImage(imageTornade, xTornade, yTornade, 100, 125);
}

function bougerTornade(){
    
    if(yTornade < 50){
        dyTornade = 0.5;
    }
    if(yTornade > 150){
        dyTornade = -0.5;
    }
    if(xTornade > 400){
        setTimeout(function() {
            xTornade = -100;
            yTornade = 50;
            dyTornade = 0.5;
        }, 2000);
    }
    xTornade = xTornade + dxTornade;
    yTornade = yTornade + dyTornade;
}


//Fonction permettant de creer des fourmis
function CreerFourmis (){
    
    
    //Choix d'une position aleatoire
    var xFourmi = rand(tailleSegmentSnake, canvas.width - tailleSegmentSnake*2, true);
    
    
    //Pour le monde de l'eau la position Y doit etre en dehors de la surface
    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
        var yFourmi = rand((tailleSegmentSnake + 15), canvas.height - tailleSegmentSnake*2, true);
    }
    
    else{
        var yFourmi = rand(tailleSegmentSnake, canvas.height - tailleSegmentSnake*2, true);
    }
    
    //Pour le monde du sable
    if((choixCouleurSerpent == "couleurSable") && (choixTypeJeux == "classique")){
        
        while(true){
            if((xFourmi > 90 && xFourmi < 140) || (xFourmi > 290 && xFourmi < 340)){
                xFourmi = rand(tailleSegmentSnake, canvas.width - tailleSegmentSnake*2, true);
            }
            if((yFourmi > 40 && yFourmi < 70) || (yFourmi > 240 && yFourmi < 270)){
                yFourmi = rand(tailleSegmentSnake, canvas.height - tailleSegmentSnake*2, true);
            }
            break;
        }
    }
    
    
    
    
    //On prend un multiple de 4
    xFourmi = xFourmi - (xFourmi % 4);
    yFourmi = yFourmi - (yFourmi % 4);
    
    /*
    
    var xRandomTest = false;
    var yRandomTest = false;
    
    console.log("choix premier x fourmi: ", xFourmi);
    console.log("choix premier y fourmi: ", yFourmi);
    
    //On s'assure que nous ne placon pas de fourmi SUR le snake et que l'on a un multiple de 4
    var longueurSnake = tableauSnake.length;
    //Si les coordonnees tombent a l'emplacement d'un morceaux de snake, on refait un random
    
    
    
    while ((xRandomTest != true)){

        xRandomTest = true;

        for(j=0; j<longueurSnake; j++){
            if (((xFourmi > (tableauSnake[j].x - tailleSegmentSnake - espacementMorceaux)) && (xFourmi < (tableauSnake[j].x + tailleSegmentSnake + espacementMorceaux))) || ((xFourmi % 4) != 0)){
                xRandomTest = false;
            }
        }
        if(xRandomTest != true){
            xFourmi = rand(tailleSegmentSnake, canvas.width - tailleSegmentSnake*2, true);
            xFourmi = xFourmi - (xFourmi % 4);
        }
        else{
            xRandomTest = true;
            break;
        }
    }
    
    
    while ((yRandomTest != true)){

        yRandomTest = true;

        for(j=0; j<longueurSnake; j++){
            if (((yFourmi > (tableauSnake[j].y - tailleSegmentSnake - espacementMorceaux)) && (yFourmi < (tableauSnake[j].y + tailleSegmentSnake + espacementMorceaux))) || ((yFourmi % 4) != 0)){
                yRandomTest = false;
            }
        }
        if(yRandomTest != true){
            yFourmi = rand(tailleSegmentSnake, canvas.height - tailleSegmentSnake*2, true);
            yFourmi = yFourmi - (yFourmi % 4);
        }
        else{
            yRandomTest = true;
            break;
        }
    }
    */
    //console.log("choix x fourmi: ", xFourmi);
    //console.log("choix y fourmi: ", yFourmi);
    
    
    //On instancie une nouvelle fourmi
    var objetFourmi = new Fourmi(xFourmi, yFourmi);
    
    //On place notre nouvelle fourmi dans le tableau
    tableauFourmis.push(objetFourmi);
}

//Apres la creation il faut afficher
function AfficherFourmis (){
    
    for (i=0; i<tableauFourmis.length; i++){
        context.strokeStyle = "white";
        context.lineWidth = "3";

        context.beginPath();
        context.moveTo(tableauFourmis[i].xFourmi, tableauFourmis[i].yFourmi + tailleSegmentSnake/2);  // 1er point
        context.lineTo(tableauFourmis[i].xFourmi, tableauFourmis[i].yFourmi); // 2e point
        context.lineTo(tableauFourmis[i].xFourmi, tableauFourmis[i].yFourmi + tailleSegmentSnake); // 3e
        context.lineTo(tableauFourmis[i].xFourmi, tableauFourmis[i].yFourmi + tailleSegmentSnake/2); // 4e
        context.lineTo(tableauFourmis[i].xFourmi + tailleSegmentSnake, tableauFourmis[i].yFourmi + tailleSegmentSnake/2);  // 5e
        context.lineTo(tableauFourmis[i].xFourmi + tailleSegmentSnake, tableauFourmis[i].yFourmi);
        context.lineTo(tableauFourmis[i].xFourmi + tailleSegmentSnake, tableauFourmis[i].yFourmi + tailleSegmentSnake/2);
        context.lineTo(tableauFourmis[i].xFourmi + tailleSegmentSnake, tableauFourmis[i].yFourmi + tailleSegmentSnake);
        context.stroke();
    }
}

function SupprimerFourmi (i){
    //On efface la fourmi de l'ecran
    context.clearRect(tableauFourmis[i].xFourmi - (tailleSegmentSnake/2) , tableauFourmis[i].yFourmi - (tailleSegmentSnake/2), tailleSegmentSnake, tailleSegmentSnake);
    //On vire la fourmi du tableau
    tableauFourmis.splice(i, 1);
}

function CollisionFourmi (positionSnakeX, positionSnakeY){
     
     for(i=0; i<tableauFourmis.length; i++){
         
        //Si on va de gauche a droite ou de droite a gauche
        if((tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0) || (tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0)){


            if (    ((positionSnakeX + (tailleSegmentSnake/2)) > tableauFourmis[i].xFourmi )    &&    ((positionSnakeX + (tailleSegmentSnake/2)) < (tableauFourmis[i].xFourmi + tailleSegmentSnake))        &&      (positionSnakeY > (tableauFourmis[i].yFourmi - tailleSegmentSnake) )      &&      (positionSnakeY <  (tableauFourmis[i].yFourmi + tailleSegmentSnake ))) {

                ///////On rajoute un morceau de snake en queue//////

                //On prepare un tableau contenant un objet Historique pour placer en historique du dernier morceau de snake ses positions et direction afin que le morceau qui sera ajoute juste derriere puisse pouvoir le suivre
                var ObjetCoordoonneesDernierElement = [];
                ObjetCoordoonneesDernierElement.push(new Historique (tableauSnake[tableauSnake.length - 1].x, tableauSnake[tableauSnake.length - 1].y, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy));

                //Faut il mettre en historique du dernier element ses propre positions pour assurer la condition plus tard?
                //tableauSnake[tableauSnake.length -1].historique = [];
                //tableauSnake[tableauSnake.length -1].historique.push(new Historique (tableauSnake[tableauSnake.length - 1].x, tableauSnake[tableauSnake.length - 1].y, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy));


                //Si le dernier element est en train d'aller de gauche a doite
                if(tableauSnake[tableauSnake.length -1].dx > 0 && tableauSnake[tableauSnake.length -1].dy === 0){
                    //On place notre novel objet sur sa gauche
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x - espacementMorceaux - tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train d'aller de doite a gauche
                if(tableauSnake[tableauSnake.length -1].dx < 0 && tableauSnake[tableauSnake.length -1].dy === 0){
                    //On place notre novel objet sur sa droite
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x + espacementMorceaux + tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train de monter
                if(tableauSnake[tableauSnake.length -1].dx === 0 && tableauSnake[tableauSnake.length -1].dy < 0){
                    //On place notre novel objet en dessous
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x, tableauSnake[tableauSnake.length - 1].y + espacementMorceaux + tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train de descendre
                if(tableauSnake[tableauSnake.length -1].dx === 0 && tableauSnake[tableauSnake.length -1].dy > 0){
                    //On place notre novel objet en dessus
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x, tableauSnake[tableauSnake.length - 1].y - espacementMorceaux - tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
       
                //On affiche notre score avec l'animation
                refreshAnimation();
                
                //On re-cree une fourmi
                CreerFourmis();
                //On supprime l'ancienne fourmi
                SupprimerFourmi(i);
            }
        }

        //Si on descend ou on monte
        if((tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0) || (tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0)){

            if (    (positionSnakeX  > (tableauFourmis[i].xFourmi - tailleSegmentSnake))    &&    (positionSnakeX  < (tableauFourmis[i].xFourmi + tailleSegmentSnake))        &&      ((positionSnakeY + tailleSegmentSnake) >  (tableauFourmis[i].yFourmi - (tailleSegmentSnake/2)) )      &&      ((positionSnakeY + tailleSegmentSnake) <  (tableauFourmis[i].yFourmi + (tailleSegmentSnake/2)))) {

                ///////On rajoute un morceau de snake en queue//////

                //On prepare un tableau contenant un objet Historique pour placer en historique du dernier morceau de snake ses positions et direction afin que le morceau qui sera ajoute juste derriere puisse pouvoir le suivre
                var ObjetCoordoonneesDernierElement = [];
                ObjetCoordoonneesDernierElement.push(new Historique (tableauSnake[tableauSnake.length - 1].x, tableauSnake[tableauSnake.length - 1].y, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy));

                //Faut il mettre en historique du dernier element ses propre positions pour assurer la condition plus tard?
                //tableauSnake[tableauSnake.length -1].historique = [];
                //tableauSnake[tableauSnake.length -1].historique.push(new Historique (tableauSnake[tableauSnake.length - 1].x, tableauSnake[tableauSnake.length - 1].y, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy));


                //Si le dernier element est en train d'aller de gauche a doite
                if(tableauSnake[tableauSnake.length -1].dx > 0 && tableauSnake[tableauSnake.length -1].dy === 0){
                    //On place notre novel objet sur sa gauche
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x - espacementMorceaux - tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train d'aller de doite a gauche
                if(tableauSnake[tableauSnake.length -1].dx < 0 && tableauSnake[tableauSnake.length -1].dy === 0){
                    //On place notre novel objet sur sa droite
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x + espacementMorceaux + tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train de monter
                if(tableauSnake[tableauSnake.length -1].dx === 0 && tableauSnake[tableauSnake.length -1].dy < 0){
                    //On place notre novel objet en dessous
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x, tableauSnake[tableauSnake.length - 1].y + espacementMorceaux + tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                //Si le dernier element est en train de descendre
                if(tableauSnake[tableauSnake.length -1].dx === 0 && tableauSnake[tableauSnake.length -1].dy > 0){
                    //On place notre novel objet en dessus
                    CreerMorceauSnake(tableauSnake[tableauSnake.length -1].x, tableauSnake[tableauSnake.length - 1].y - espacementMorceaux - tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnake[tableauSnake.length - 1].dx, tableauSnake[tableauSnake.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnake);
                }
                
                //On affiche notre score avec l'animation
                refreshAnimation();
                
                //On re-cree une fourmi
                CreerFourmis();
                //On supprime l'ancienne fourmi
                SupprimerFourmi(i);
            }
        }
    }
    //Affichage du Score
    afficherScore(choixTypeJeux);
}

//PC
function CollisionFourmiPC (positionSnakeX, positionSnakeY){
     
     for(i=0; i<tableauFourmis.length; i++){
         
        //Si on va de gauche a droite ou de droite a gauche
        if((tableauSnakePC[0].dx > 0 && tableauSnakePC[0].dy === 0) || (tableauSnakePC[0].dx < 0 && tableauSnakePC[0].dy === 0)){


            if (    ((positionSnakeX + tailleSegmentSnake) > tableauFourmis[i].xFourmi )    &&    ((positionSnakeX + tailleSegmentSnake) < (tableauFourmis[i].xFourmi + tailleSegmentSnake))        &&      (positionSnakeY > (tableauFourmis[i].yFourmi - tailleSegmentSnake) )      &&      (positionSnakeY <  (tableauFourmis[i].yFourmi + tailleSegmentSnake ))) {

                ///////On rajoute un morceau de snake en queue//////

                //On prepare un tableau contenant un objet Historique pour placer en historique du dernier morceau de snake ses positions et direction afin que le morceau qui sera ajoute juste derriere puisse pouvoir le suivre
                var ObjetCoordoonneesDernierElement = [];
                ObjetCoordoonneesDernierElement.push(new Historique (tableauSnakePC[tableauSnakePC.length - 1].x, tableauSnakePC[tableauSnakePC.length - 1].y, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy));

                //Faut il mettre en historique du dernier element ses propre positions pour assurer la condition plus tard?
                //tableauSnakePC[tableauSnakePC.length -1].historique = [];
                //tableauSnakePC[tableauSnakePC.length -1].historique.push(new Historique (tableauSnakePC[tableauSnakePC.length - 1].x, tableauSnakePC[tableauSnakePC.length - 1].y, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy));


                //Si le dernier element est en train d'aller de gauche a doite
                if(tableauSnakePC[tableauSnakePC.length -1].dx > 0 && tableauSnakePC[tableauSnakePC.length -1].dy === 0){
                    //On place notre novel objet sur sa gauche
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x - espacementMorceaux - tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train d'aller de doite a gauche
                if(tableauSnakePC[tableauSnakePC.length -1].dx < 0 && tableauSnakePC[tableauSnakePC.length -1].dy === 0){
                    //On place notre novel objet sur sa droite
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x + espacementMorceaux + tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train de monter
                if(tableauSnakePC[tableauSnakePC.length -1].dx === 0 && tableauSnakePC[tableauSnakePC.length -1].dy < 0){
                    //On place notre novel objet en dessous
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x, tableauSnakePC[tableauSnakePC.length - 1].y + espacementMorceaux + tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train de descendre
                if(tableauSnakePC[tableauSnakePC.length -1].dx === 0 && tableauSnakePC[tableauSnakePC.length -1].dy > 0){
                    //On place notre novel objet en dessus
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x, tableauSnakePC[tableauSnakePC.length - 1].y - espacementMorceaux - tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }

                //On re-cree une fourmi
                CreerFourmis();
                //On supprime l'ancienne fourmi
                SupprimerFourmi(i);
                
                //On determine quelle est la fourmi la plus proche a atteindre
                fourmiSuivante = calculDistance();
            }
        }

        //Si on descend ou on monte
        if((tableauSnakePC[0].dx === 0 && tableauSnakePC[0].dy > 0) || (tableauSnakePC[0].dx === 0 && tableauSnakePC[0].dy < 0)){

            if (    (positionSnakeX  > (tableauFourmis[i].xFourmi - tailleSegmentSnake))    &&    (positionSnakeX  < (tableauFourmis[i].xFourmi + tailleSegmentSnake))        &&      ((positionSnakeY + tailleSegmentSnake) >  tableauFourmis[i].yFourmi )      &&      ((positionSnakeY + tailleSegmentSnake) <  (tableauFourmis[i].yFourmi + tailleSegmentSnake))) {

                ///////On rajoute un morceau de snake en queue//////

                //On prepare un tableau contenant un objet Historique pour placer en historique du dernier morceau de snake ses positions et direction afin que le morceau qui sera ajoute juste derriere puisse pouvoir le suivre
                var ObjetCoordoonneesDernierElement = [];
                ObjetCoordoonneesDernierElement.push(new Historique (tableauSnakePC[tableauSnakePC.length - 1].x, tableauSnakePC[tableauSnakePC.length - 1].y, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy));

                //Faut il mettre en historique du dernier element ses propre positions pour assurer la condition plus tard?
                //tableauSnakePC[tableauSnakePC.length -1].historique = [];
                //tableauSnakePC[tableauSnakePC.length -1].historique.push(new Historique (tableauSnakePC[tableauSnakePC.length - 1].x, tableauSnakePC[tableauSnakePC.length - 1].y, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy));


                //Si le dernier element est en train d'aller de gauche a doite
                if(tableauSnakePC[tableauSnakePC.length -1].dx > 0 && tableauSnakePC[tableauSnakePC.length -1].dy === 0){
                    //On place notre novel objet sur sa gauche
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x - espacementMorceaux - tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train d'aller de doite a gauche
                if(tableauSnakePC[tableauSnakePC.length -1].dx < 0 && tableauSnakePC[tableauSnakePC.length -1].dy === 0){
                    //On place notre novel objet sur sa droite
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x + espacementMorceaux + tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].y, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train de monter
                if(tableauSnakePC[tableauSnakePC.length -1].dx === 0 && tableauSnakePC[tableauSnakePC.length -1].dy < 0){
                    //On place notre novel objet en dessous
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x, tableauSnakePC[tableauSnakePC.length - 1].y + espacementMorceaux + tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }
                //Si le dernier element est en train de descendre
                if(tableauSnakePC[tableauSnakePC.length -1].dx === 0 && tableauSnakePC[tableauSnakePC.length -1].dy > 0){
                    //On place notre novel objet en dessus
                    CreerMorceauSnakePC(tableauSnakePC[tableauSnakePC.length -1].x, tableauSnakePC[tableauSnakePC.length - 1].y - espacementMorceaux - tailleSegmentSnake, tailleSegmentSnake, tailleSegmentSnake, tableauSnakePC[tableauSnakePC.length - 1].dx, tableauSnakePC[tableauSnakePC.length - 1].dy, ObjetCoordoonneesDernierElement, couleurSnakePC);
                }

                //On re-cree une fourmi
                CreerFourmis();
                //On supprime l'ancienne fourmi
                SupprimerFourmi(i);
                //On determine quelle est la fourmi la plus proche a atteindre
                fourmiSuivante = calculDistance();
            }
        }
    }
}


function CollisionSnake (positionSnakeX, positionSnakeY){
    
    for (i=1; i<tableauSnake.length-1; i++){
        
        //Si on va de gauche a droite
        if(tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0){

            if (    ((positionSnakeX + tailleSegmentSnake) > tableauSnake[i].x )    &&    ((positionSnakeX + tailleSegmentSnake) < (tableauSnake[i].x + (tailleSegmentSnake)))        &&      (positionSnakeY > (tableauSnake[i].y - tailleSegmentSnake) )      &&      (positionSnakeY <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition de gauche a droite !");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                } 
            }
        }
        
        //Si on va de droite a gauche
        if(tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0){

            if (    (positionSnakeX < (tableauSnake[i].x + tailleSegmentSnake))    &&    (positionSnakeX  > (tableauSnake[i].x))        &&      (positionSnakeY > (tableauSnake[i].y - tailleSegmentSnake) )      &&      ((positionSnakeY) <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition de droite a gauche!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
        
        //Si on descend
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0){

            if (   (positionSnakeX > (tableauSnake[i].x - tailleSegmentSnake)) &&   (positionSnakeX  < (tableauSnake[i].x + tailleSegmentSnake))       &&      ((positionSnakeY + tailleSegmentSnake) >  tableauSnake[i].y )      &&      ((positionSnakeY + tailleSegmentSnake) <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition on descend!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
        //Si on monte
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0){

            if (    (positionSnakeX  > (tableauSnake[i].x - tailleSegmentSnake ))    &&    (positionSnakeX < (tableauSnake[i].x + tailleSegmentSnake))        &&      (positionSnakeY <  (tableauSnake[i].y + tailleSegmentSnake))      &&      (positionSnakeY >  (tableauSnake[i].y))) {
                //alert("Condition on monte!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
    }
}

function CollisionSnakeGirls (positionSnakeX, positionSnakeY){
    
    for (i=1; i<tableauSnake.length-1; i++){
                                                                    
        //Si on va de gauche a droite ET que juste avant on allait PAS de droite a gauche
        if((tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0) && (tableauSnake[0].y != tableauSnake[i].y)){
            
  

            if (    ((positionSnakeX + tailleSegmentSnake) > tableauSnake[i].x )    &&    ((positionSnakeX + tailleSegmentSnake) < (tableauSnake[i].x + (tailleSegmentSnake)))        &&      (positionSnakeY > (tableauSnake[i].y - tailleSegmentSnake) )      &&      (positionSnakeY <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition de gauche a droite !");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                } 
            }
        }
        
        //Si on va de droite a gauche ET que juste avant on allait PAS de gauche a droite
        if((tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0) && (tableauSnake[0].y != tableauSnake[i].y)){

            if (    (positionSnakeX < (tableauSnake[i].x + tailleSegmentSnake))    &&    (positionSnakeX  > (tableauSnake[i].x))        &&      (positionSnakeY > (tableauSnake[i].y - tailleSegmentSnake) )      &&      ((positionSnakeY) <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition de droite a gauche!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
        
        //Si on descend ET que juste avant on allait PAS vers le haut
        if((tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0) && (tableauSnake[0].x != tableauSnake[i].x)){

            if (   (positionSnakeX > (tableauSnake[i].x - tailleSegmentSnake)) &&   (positionSnakeX  < (tableauSnake[i].x + tailleSegmentSnake))       &&      ((positionSnakeY + tailleSegmentSnake) >  tableauSnake[i].y )      &&      ((positionSnakeY + tailleSegmentSnake) <  (tableauSnake[i].y + tailleSegmentSnake))) {
                //alert("Condition on descend!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
        //Si on monte ET que juste avant on allait PAS vers le bas
        if((tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0) && (tableauSnake[0].x != tableauSnake[i].x)){

            if (    (positionSnakeX  > (tableauSnake[i].x - tailleSegmentSnake ))    &&    (positionSnakeX < (tableauSnake[i].x + tailleSegmentSnake))        &&      (positionSnakeY <  (tableauSnake[i].y + tailleSegmentSnake))      &&      (positionSnakeY >  (tableauSnake[i].y))) {
                //alert("Condition on monte!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                        directionVagues = "baisse";
                    }
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        xTornade = -200;
                        yTornade = -50;
                    }
                    relancerSnake ();                    
                }
                else{
                    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
                        choixCouleurSerpent = '';
                        divCouleurJungle.style.border = "1px solid white";
                    }
                    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
                        xVagues = 0;
                        yVagues = 0;
                    }
                    relancerSnake ();
                    divOverlay.style.display = "flex";
                }
            }
        }
    }
}

function colisionCailloux (positionSnakeX, positionSnakeY) {
    
    //Collision cailloux 1
    
    //Si on va de gauche a droite
        if(tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0){

            if (    ((positionSnakeX + tailleSegmentSnake) > 100 )    &&    ((positionSnakeX + tailleSegmentSnake) < 140)        &&      (positionSnakeY > (50 - tailleSegmentSnake) )      &&      (positionSnakeY <  70)) {
                //alert("Condition de gauche a droite !");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                } 
            }
        }
        
        //Si on va de droite a gauche
        if(tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0){

            if (    (positionSnakeX < 140)    &&    (positionSnakeX  > 100)        &&      (positionSnakeY > (50 - tailleSegmentSnake) )      &&      (positionSnakeY <  70)) {
                //alert("Condition de droite a gauche!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
        
        //Si on descend
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0){

            if (   (positionSnakeX > (100 - tailleSegmentSnake)) &&   (positionSnakeX  < 140)       &&      ((positionSnakeY + tailleSegmentSnake) >  50 )      &&      ((positionSnakeY + tailleSegmentSnake) <  70)) {
                //alert("Condition on descend!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
        //Si on monte
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0){

            if (    (positionSnakeX > (100 - tailleSegmentSnake)) &&   (positionSnakeX  < 140)         &&      (positionSnakeY <  70)      &&      (positionSnakeY >  50)) {
                //alert("Condition on monte!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
        
    //Collision cailloux 2
    
    //Si on va de gauche a droite
        if(tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0){

            if (    ((positionSnakeX + tailleSegmentSnake) > 300 )    &&    ((positionSnakeX + tailleSegmentSnake) < 340)        &&      (positionSnakeY > (250 - tailleSegmentSnake) )      &&      (positionSnakeY <  270)) {
                //alert("Condition de gauche a droite !");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                } 
            }
        }
        
        //Si on va de droite a gauche
        if(tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0){

            if (    (positionSnakeX < 340)    &&    (positionSnakeX  > 300)        &&      (positionSnakeY > (250 - tailleSegmentSnake) )      &&      (positionSnakeY <  270)) {
                //alert("Condition de droite a gauche!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
        
        //Si on descend
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0){

            if (   (positionSnakeX > (300 - tailleSegmentSnake)) &&   (positionSnakeX  < 340)       &&      ((positionSnakeY + tailleSegmentSnake) >  250 )      &&      ((positionSnakeY + tailleSegmentSnake) <  270)) {
                //alert("Condition on descend!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
        //Si on monte
        if(tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0){

            if (    (positionSnakeX > (300 - tailleSegmentSnake)) &&   (positionSnakeX  < 340)         &&      (positionSnakeY <  270)      &&      (positionSnakeY >  250)) {
                //alert("Condition on monte!");
                MeilleurScore = getMeilleurScore('classique');
                
                if (tableauSnake.length-2 > MeilleurScore){
                    //je met a jour mon cookie
                    setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
                }
                if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                    relancerSnake ();                    
                }
                else{
                    relancerSnake ();   
                    divOverlay.style.display = "flex";
                }
            }
        }
}

function colisionVagues (positionSnakeY) {
    
    if (    ((positionSnakeY +  (tailleSegmentSnake / 2)) < (yVagues + 20) )    &&    ((positionSnakeY +  (tailleSegmentSnake / 2)) > 0) ){
        //alert("Condition on monte!");
        MeilleurScore = getMeilleurScore('classique');

        if (tableauSnake.length-2 > MeilleurScore){
            //je met a jour mon cookie
            setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
        }
        if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
            xVagues = 0;
            yVagues = 0;
            directionVagues = "baisse";
            relancerSnake ();
        }
        else{
            xVagues = 0;
            yVagues = 0;
            relancerSnake ();
            divOverlay.style.display = "flex";
        }
    }
}

function colisionTornade (positionSnakeX, positionSnakeY) {
    
    //Si on va de gauche a droite
    if(tableauSnake[0].dx > 0 && tableauSnake[0].dy === 0){

        if (    ((positionSnakeX + tailleSegmentSnake) > xTornade )    &&    ((positionSnakeX + tailleSegmentSnake) < (xTornade + 100))        &&      (positionSnakeY > (yTornade - tailleSegmentSnake) )      &&      (positionSnakeY <  (yTornade + 125))) {
            //alert("Condition de gauche a droite !");
            MeilleurScore = getMeilleurScore('classique');

            if (tableauSnake.length-2 > MeilleurScore){
                //je met a jour mon cookie
                setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
            }
            if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                //On replace la tornade en position initiale
                xTornade = -200;
                yTornade = -50;
                relancerSnake ();
            }
            else{
                choixCouleurSerpent = '';
                divCouleurJungle.style.border = "1px solid white";
                relancerSnake ();
                divOverlay.style.display = "flex";
            } 
        }
    }

    //Si on va de droite a gauche
    if(tableauSnake[0].dx < 0 && tableauSnake[0].dy === 0){

        if (    (positionSnakeX < (xTornade + 100))    &&    (positionSnakeX  > xTornade)        &&      (positionSnakeY > (yTornade - tailleSegmentSnake) )      &&      (positionSnakeY <  (yTornade + 125))) {
            //alert("Condition de droite a gauche!");
            MeilleurScore = getMeilleurScore('classique');

            if (tableauSnake.length-2 > MeilleurScore){
                //je met a jour mon cookie
                setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
            }
            if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                //On replace la tornade en position initiale
                xTornade = -200;
                yTornade = -50;
                relancerSnake ();
            }
            else{
                choixCouleurSerpent = '';
                divCouleurJungle.style.border = "1px solid white";
                relancerSnake ();
                divOverlay.style.display = "flex";
            }
        }
    }

    //Si on descend
    if(tableauSnake[0].dx === 0 && tableauSnake[0].dy > 0){

        if (   (positionSnakeX > (xTornade - tailleSegmentSnake)) &&   (positionSnakeX  < (xTornade + 100))       &&      ((positionSnakeY + tailleSegmentSnake) >  yTornade )      &&      ((positionSnakeY + tailleSegmentSnake) <  (yTornade + 125))) {
            //alert("Condition on descend!");
            MeilleurScore = getMeilleurScore('classique');

            if (tableauSnake.length-2 > MeilleurScore){
                //je met a jour mon cookie
                setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
            }
            if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                //On replace la tornade en position initiale
                xTornade = -200;
                yTornade = -50;
                relancerSnake ();                    
            }
            else{
                choixCouleurSerpent = '';
                divCouleurJungle.style.border = "1px solid white";
                relancerSnake ();
                divOverlay.style.display = "flex";
            }
        }
    }
    //Si on monte
    if(tableauSnake[0].dx === 0 && tableauSnake[0].dy < 0){

        if (    (positionSnakeX > (xTornade - tailleSegmentSnake)) &&   (positionSnakeX  < (xTornade + 100))         &&      (positionSnakeY <  (yTornade + 125))      &&      (positionSnakeY >  yTornade)) {
            //alert("Condition on monte!");
            MeilleurScore = getMeilleurScore('classique');

            if (tableauSnake.length-2 > MeilleurScore){
                //je met a jour mon cookie
                setCookie("MeilleurScoreSnakeClassique", tableauSnake.length - 2);
            }
            if ( confirm ('Bim! Ton score est de: ' + (tableauSnake.length - 2) + '. Rejouer?') ){
                //On replace la tornade en position initiale
                xTornade = -200;
                yTornade = -50;
                relancerSnake ();                    
            }
            else{
                choixCouleurSerpent = '';
                divCouleurJungle.style.border = "1px solid white";
                relancerSnake ();
                divOverlay.style.display = "flex";
            }
        }
    }
    }



//Fonction calculant la distance pour se rendre a chaque fourmi
function calculDistance () {
    
    var distanceX = 0;
    var distanceY = 0;
    
    //Pour chaque fourmis
    for(i=0; i<tableauFourmis.length; i++){
        
        //On calcul la distance entre la tete de notre serpent PC et la fourmi. X ET Y que l'on ajoute
        distanceX = Math.abs(tableauFourmis[i].xFourmi - tableauSnakePC[0].x);
        distanceY = Math.abs(tableauFourmis[i].yFourmi - tableauSnakePC[0].y);
        
        //On met le resultat dans des variables respectives
        if(i === 0){
            distanceFourmi1 = distanceX + distanceY;
        }
        if(i === 1){
            distanceFourmi2 = distanceX + distanceY;
        }   
    }
    //On renvoi le numero de la fourmi qui est la plus proche a atteindre
    if(distanceFourmi1 < distanceFourmi2){
        return "0";
    }
    if(distanceFourmi1 > distanceFourmi2){
        return "1";
    }
    //Si on a une egalite, par defaut on prend la premiere
    else{
        return "0";
    }
}

function directionPC (numeroFourmi) {
    
    //console.log("x fourmi: ", tableauFourmis[numeroFourmi].xFourmi);
    //console.log("x snakePC: ", tableauSnakePC[0].x);
    
    if(tableauSnakePC[0].x == tableauFourmis[numeroFourmi].xFourmi){
        //console.log("je suis dans la condition egalitaire");
        if(tableauSnakePC[0].y < tableauFourmis[numeroFourmi].yFourmi){
            tableauSnakePC[0].dx = 0;
            tableauSnakePC[0].dy = vitesse;
            //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
            tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
        }
        else if(tableauSnakePC[0].y > tableauFourmis[numeroFourmi].yFourmi){
            tableauSnakePC[0].dx = 0;
            tableauSnakePC[0].dy = -vitesse;
            //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
            tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
        }
    }
    if(tableauSnakePC[0].x < tableauFourmis[numeroFourmi].xFourmi){
        tableauSnakePC[0].dx = vitesse;
        tableauSnakePC[0].dy = 0;
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
    }
    if(tableauSnakePC[0].x > tableauFourmis[numeroFourmi].xFourmi){
        tableauSnakePC[0].dx = -vitesse;
        tableauSnakePC[0].dy = 0;
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
    }
    
}



//Fonction permettant de bouger les morceaux de snake avec leur nouvelles coordonnees
function BougerSnake(){
    
    
    //Si on a un snake PC
    if(tableauSnakePC != ''){
        //Si on rencontre une fourmi
        CollisionFourmiPC (tableauSnakePC[0].x, tableauSnakePC[0].y);
        
        directionPC(fourmiSuivante);
       
        var longueurSnakePC = tableauSnakePC.length;

        //On change les coordonnees de la tete du serpent qui sert de reference pour les autres
        tableauSnakePC[0].x = tableauSnakePC[0].x + tableauSnakePC[0].dx;
        tableauSnakePC[0].y = tableauSnakePC[0].y + tableauSnakePC[0].dy;
        
        //Et on l'affiche
        AfficherLanguePC(0);
        

        //Si la tete arrive sur un bord

        //Bord droit - On modifie les coordonnees de x pour reprendre depuis le bord gauche
        if(tableauSnakePC[0].x > canvas.width - tailleSegmentSnake){
            //console.log("Je suis cote droit");
            tableauSnakePC[0].x = 0;
        }
        //Bord gauche
        if(tableauSnakePC[0].x < 0){
            //console.log("Je suis cote gauche");
            tableauSnakePC[0].x = canvas.width - tailleSegmentSnake;
        }
        //Bord du haut
        if(tableauSnakePC[0].y < 0){
            //console.log("Je suis top");
            tableauSnakePC[0].y = canvas.height - tailleSegmentSnake;
        }
        if(tableauSnakePC[0].y > canvas.height - tailleSegmentSnake){
            //console.log("Je suis bottom");
            tableauSnakePC[0].y = 0;
        }

        ////// Gestion du corps du snake ////////

        for(j=1; j < longueurSnakePC; j++){

            //Closure
            (function() {

                var currentJ = j;

                //Si il y a des infos dans l'historique de l'element precedent
                if (tableauSnakePC[currentJ-1].historique.length > 0){

                    //Si notre morceaux arrive au moment ou celui qui le precede avait change de direction
                    if((tableauSnakePC[currentJ].x == tableauSnakePC[currentJ-1].historique[0].xHistorique) && (tableauSnakePC[currentJ].y == tableauSnakePC[currentJ-1].historique[0].yHistorique)){

                        //On doit changer de direction pour l'element courrant en utilisant les infos de directions de l'element precedent
                        tableauSnakePC[currentJ].dx = tableauSnakePC[currentJ-1].historique[0].dxHistorique;
                        tableauSnakePC[currentJ].dy = tableauSnakePC[currentJ-1].historique[0].dyHistorique;

                        //Il faut supprimer la ligne Historique de l'element precedent que l'on vient d'utiliser
                        tableauSnakePC[currentJ-1].historique.shift();

                        //On creer ensuite un objet Historique sur l'element qui est sur le point de changer de direction pour un objet qui ne serait pas le dernier du snake
                        if(currentJ < longueurSnakePC - 1){
                            tableauSnakePC[currentJ].historique.push(new Historique (tableauSnakePC[currentJ].x, tableauSnakePC[currentJ].y, tableauSnakePC[currentJ].dx, tableauSnakePC[currentJ].dy));
                        }
                        //Si c'est le dernier du snake, il nous faut enregistrer uniquement les infos de changement de direction
                        else if(tableauSnakePC[currentJ].historique.length > 1){
                            tableauSnakePC[currentJ].historique = [];
                            tableauSnakePC[currentJ].historique.push(new Historique (tableauSnakePC[currentJ].x, tableauSnakePC[currentJ].y, tableauSnakePC[currentJ].dx, tableauSnakePC[currentJ].dy));
                        }
                    }
                }

                //On modifie les coordonnees du morceaux
                tableauSnakePC[currentJ].x = tableauSnakePC[currentJ].x + tableauSnakePC[currentJ].dx;
                tableauSnakePC[currentJ].y = tableauSnakePC[currentJ].y + tableauSnakePC[currentJ].dy;

                //Si on arrive sur un bord

                //Bord droit - On modifie les coordonnees de x pour reprendre depuis le bord gauche
                if(tableauSnakePC[currentJ].x > canvas.width - tailleSegmentSnake){
                    //console.log("Je suis cote droit");
                    tableauSnakePC[currentJ].x = 0;
                }
                //Bord gauche
                if(tableauSnakePC[currentJ].x < 0){
                    //console.log("Je suis cote gauche");
                    tableauSnakePC[currentJ].x = canvas.width - tailleSegmentSnake;
                }
                //Bord du haut
                if(tableauSnakePC[currentJ].y < 0){
                    //console.log("Je suis top");
                    tableauSnakePC[currentJ].y = canvas.height - tailleSegmentSnake;
                }
                if(tableauSnakePC[currentJ].y > canvas.height - tailleSegmentSnake){
                    //console.log("Je suis bottom");
                    tableauSnakePC[currentJ].y = 0;
                }

                //On affiche la tete
                if (j === 1){
                    AfficherTetePC(1);
                }
                else{
                //On affiche le reste des morceaux
                    AfficherMorceauSnakePC(currentJ);
                }
                
            })();
        }
    }
    
    
    
    
    //Si on rencontre une fourmi
    CollisionFourmi (tableauSnake[0].x, tableauSnake[0].y);
    
    //Si on rencontre un cailloux
    if((choixCouleurSerpent == "couleurSable") && (choixTypeJeux == "classique")){
        colisionCailloux (tableauSnake[0].x, tableauSnake[0].y);
    }
    
    //Si on rencontre les vagues
    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
        colisionVagues (tableauSnake[0].y);
    }
    
    //Si on rencontre la tornade
    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
        colisionTornade (tableauSnake[0].x, tableauSnake[0].y);
    }
    
    var longueurSnake = tableauSnake.length;
    
    

    //On change les coordonnees de la tete du serpent qui sert de reference pour les autres
    tableauSnake[0].x = tableauSnake[0].x + tableauSnake[0].dx;
    tableauSnake[0].y = tableauSnake[0].y + tableauSnake[0].dy;
    //Et on l'affiche
    AfficherLangue(0);

    //Si la tete arrive sur un bord

    //Bord droit - On modifie les coordonnees de x pour reprendre depuis le bord gauche
    if(tableauSnake[0].x > canvas.width - tailleSegmentSnake){
        //console.log("Je suis cote droit");
        tableauSnake[0].x = 0;
    }
    //Bord gauche
    if(tableauSnake[0].x < 0){
        //console.log("Je suis cote gauche");
        tableauSnake[0].x = canvas.width - tailleSegmentSnake;
    }
    //Bord du haut
    if(tableauSnake[0].y < 0){
        //console.log("Je suis top");
        tableauSnake[0].y = canvas.height - tailleSegmentSnake;
    }
    if(tableauSnake[0].y > canvas.height - tailleSegmentSnake){
        //console.log("Je suis bottom");
        tableauSnake[0].y = 0;
    }
            
    ////// Gestion du corps du snake ////////
            
    for(i=1; i < longueurSnake; i++){
        
        //Closure
        (function() {
            
            var currentI = i;

            //Si il y a des infos dans l'historique de l'element precedent
            if (tableauSnake[currentI-1].historique.length > 0){

                //Si notre morceaux arrive au moment ou celui qui le precede avait change de direction
                if((tableauSnake[currentI].x == tableauSnake[currentI-1].historique[0].xHistorique) && (tableauSnake[currentI].y == tableauSnake[currentI-1].historique[0].yHistorique)){

                    //On doit changer de direction pour l'element courrant en utilisant les infos de directions de l'element precedent
                    tableauSnake[currentI].dx = tableauSnake[currentI-1].historique[0].dxHistorique;
                    tableauSnake[currentI].dy = tableauSnake[currentI-1].historique[0].dyHistorique;

                    //Il faut supprimer la ligne Historique de l'element precedent que l'on vient d'utiliser
                    tableauSnake[currentI-1].historique.shift();

                    //On creer ensuite un objet Historique sur l'element qui est sur le point de changer de direction pour un objet qui ne serait pas le dernier du snake
                    if(currentI < longueurSnake - 1){
                        tableauSnake[currentI].historique.push(new Historique (tableauSnake[currentI].x, tableauSnake[currentI].y, tableauSnake[currentI].dx, tableauSnake[currentI].dy));
                    }
                    //Si c'est le dernier du snake, il nous faut enregistrer uniquement les infos de changement de direction
                    else if(tableauSnake[currentI].historique.length > 1){
                        tableauSnake[currentI].historique = [];
                        tableauSnake[currentI].historique.push(new Historique (tableauSnake[currentI].x, tableauSnake[currentI].y, tableauSnake[currentI].dx, tableauSnake[currentI].dy));
                    }
                }
            }

            //On modifie les coordonnees du morceaux
            tableauSnake[currentI].x = tableauSnake[currentI].x + tableauSnake[currentI].dx;
            tableauSnake[currentI].y = tableauSnake[currentI].y + tableauSnake[currentI].dy;

            //Si on arrive sur un bord

            //Bord droit - On modifie les coordonnees de x pour reprendre depuis le bord gauche
            if(tableauSnake[currentI].x > canvas.width - tailleSegmentSnake){
                //console.log("Je suis cote droit");
                tableauSnake[currentI].x = 0;
            }
            //Bord gauche
            if(tableauSnake[currentI].x < 0){
                //console.log("Je suis cote gauche");
                tableauSnake[currentI].x = canvas.width - tailleSegmentSnake;
            }
            //Bord du haut
            if(tableauSnake[currentI].y < 0){
                //console.log("Je suis top");
                tableauSnake[currentI].y = canvas.height - tailleSegmentSnake;
            }
            if(tableauSnake[currentI].y > canvas.height - tailleSegmentSnake){
                //console.log("Je suis bottom");
                tableauSnake[currentI].y = 0;
            }
            
            //On affiche la tete
            if (i === 1){
                AfficherTete(1);
            }
            else{
            //On affiche le reste des morceaux
                AfficherMorceauSnake(currentI);
            }
            
        })();
    }
    
    //Re-affichage de la fourmi
    AfficherFourmis();
    
    
    
    
    //On s'occupe du score pour le mode battle
    if(choixTypeJeux == "battle"){
        if((longueurSnake) == NbFourmiWinBattle || (longueurSnakePC == NbFourmiWinBattle)){
            
            if(longueurSnake == NbFourmiWinBattle){
                
                //Permet de realiser le traitement sur le cookie et renvoyer le resultat
                scoreBattle('gagne');
                if ( confirm ('Felicitation! Tu as vaincu l\'anaconda! Ton ratio de victoires et desormais de' + RatioScoreBattle + '. Rejouer?') ){
                    relancerSnake ();
                    relancerSnakePC ();
                }
                else{
                    relancerSnake ();
                    tableauSnakePC = [];
                    divOverlay.style.display = "flex";
                }
                
            }
            else if(longueurSnakePC == NbFourmiWinBattle){
                //Permet de realiser le traitement sur le cookie et renvoyer le resultat
                scoreBattle('perd');
                if ( confirm ('Dommage! L\'annaconda a ete trop rapide pour toi. Ton ratio de victoires est maintenant de ' + RatioScoreBattle + '. Rejouer?') ){
                    relancerSnake ();
                    relancerSnakePC ();
                }
                else{
                    relancerSnake ();
                    tableauSnakePC = [];
                    divOverlay.style.display = "flex";
                }
            }
        }
    }
    
    //Si on se rentre dedans pour le mode classique
    if((choixTypeJeux == "classique") && (choixDifficulte != "girls")){
        CollisionSnake(tableauSnake[0].x, tableauSnake[0].y);
    }
    else if((choixTypeJeux == "classique") && (choixDifficulte == "girls")){
        CollisionSnakeGirls(tableauSnake[0].x, tableauSnake[0].y);
    }
    
}

function AnimerSnake () {
    //On efface tout le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //Si on est au monde de l'eau
    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
        
        afficherSoleilCouchant();
        afficherVagues(xVagues, yVagues);
        bougerVagues();
        
    }
    //Si autre que le monde de l'eau, comportement normal pour l'affichage du fond
    else{
        
        context.drawImage(imageFond, 0, 0);

        if((choixCouleurSerpent == "couleurSable") && (choixTypeJeux == "classique")){
            afficherCailloux();
        }
        if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){

        }

        if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
            bougerTornade();
            afficherTornade(xTornade, yTornade);
        }
    }
        
    //window.requestAnimationFrame(function() { AnimerSnake() });
    
    //On modifie les morceaux pour les reafficher ensuite
    BougerSnake ();
}


////////////////////////////// EVENEMENTS //////////////////////////////////////

//Notre fonction permettant de verifier si tous les choix ont ete faits
function testReady (){
    if((choixTypeJeux != '') && (choixTypeSerpent != '') && (choixCouleurSerpent != '') && (choixDifficulte != '')){
        if ( confirm( "READY?\nCommandes:\n-Direction: Fleches de direction\n-Pause: Barre d'espace\n-Retour au menu: Echap" ) ) {
            divOverlay.style.display = "none";
            
            if(choixTypeJeux == "classique"){
                tableauSnakePC = [];
                if(choixCouleurSerpent == "couleurSable"){
                    imageFond.src = 'images/textureSerpentSable.jpg'; 
                }
                if(choixCouleurSerpent == "couleurJungle"){
                    imageFond.src = 'images/textureSerpentJungle.jpg'; 
                    xTornade = - 200;
                    yTornade = 50;
                    dxTornade = 0.5;
                    dyTornade = 0.5;
                }
                if(choixCouleurSerpent == "couleurEau"){
                    imageFond.src = 'images/textureSerpentEau.png';
                    xVagues = 0;
                    yVagues = 0;
                    directionVagues = "baisse";
                }
            }
            
            if(choixTypeJeux == "battle"){
                ////// Premier lancement PC ///////
                console.log("je lance le snakePC");
                imageFond.src = 'images/textureBattle.jpg'; 
                context.drawImage(imageFond, 0, 0);
                relancerSnakePC ();
                //EvenementsPC();
            }
            
            //Calibrage de la vitesse
            if(choixDifficulte == "facile"){
                vitesse = 1;
                divAffichageDifficulte.innerHTML = 'Difficulte: Facile'
            }else if((choixDifficulte == "moyen") || (choixDifficulte == "girls")){
                vitesse = 2;
                divAffichageDifficulte.innerHTML = 'Difficulte: Moyen'
            }else if(choixDifficulte == "difficile"){
                vitesse = 4;
                divAffichageDifficulte.innerHTML = 'Difficulte: Difficile'
            }
            //Calibrage de la couleur du serpent
            if(choixCouleurSerpent == "couleurSable"){
                couleurSnake = "rgb(236,216,191)";
            }else if(choixCouleurSerpent == "couleurJungle"){
                couleurSnake = "rgb(133,193,134)";
            }else if(choixCouleurSerpent == "couleurEau"){
                couleurSnake = "rgb(2,66,160)";
            }
            //Calibrage du type de serpent
            if(choixTypeSerpent == "vipere"){
                espacementMorceaux = 0;
            }else if((choixTypeSerpent == "constricteur") && ((choixDifficulte == "facile") || (choixDifficulte == "moyen"))){
                espacementMorceaux = 2;
            }else if((choixTypeSerpent == "constricteur") && (choixDifficulte == "difficile")){
                espacementMorceaux = 4;
            }
            
            relancerSnake();
        }
        //Sinon on desselection tout et on re-initialise les variables
        else {
            divTypeJeuxClassique.style.border = "1px solid black";
            divTypeJeuxBattle.style.border = "1px solid black";
            
            divTypeSerpentConstricteur.style.border = "1px solid black";
            divTypeSerpentVipere.style.border = "1px solid black";
            
            divCouleurEau.style.border = "1px solid white";
            divCouleurSable.style.border = "1px solid white";
            divCouleurJungle.style.border = "1px solid white";
            
            divDifficile.style.border = "1px solid white";
            divMoyen.style.border = "1px solid white";
            divFacile.style.border = "1px solid white";
            divGirls.style.border = "1px solid white";
            
            choixTypeJeux = '';
            choixTypeSerpent = '';
            choixCouleurSerpent = '';
            choixDifficulte = '';
        }
    }
}



//Je dois creer mes evenements grace a cette fonction car cette derniere sera rappellee a chaques fois qu'un evenement s'est declenche puis a ete desactive
function Evenements (){
    document.addEventListener("keydown", EventKeydown);
}

//J'ai du creer une fonction nommee pour pouvoir y acceder lors de la suppression d'evenement. (impossible a faire avec une fonction anonyme)
function EventKeydown(e) {
    
    //Fleche de GAUCHE
    if(e.keyCode == 37){
        e.preventDefault();
        
        //On modifie la direction pour la tete
        tableauSnake[0].dx = -vitesse;
        tableauSnake[0].dy = 0;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnake[0].historique.push(new Historique (tableauSnake[0].x, tableauSnake[0].y, tableauSnake[0].dx, tableauSnake[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche du HAUT
    if(e.keyCode == 38){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnake[0].dx = 0;
        tableauSnake[0].dy = -vitesse;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnake[0].historique.push(new Historique (tableauSnake[0].x, tableauSnake[0].y, tableauSnake[0].dx, tableauSnake[0].dy));

        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche de DROITE
    if(e.keyCode == 39){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnake[0].dx = vitesse;
        tableauSnake[0].dy = 0;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnake[0].historique.push(new Historique (tableauSnake[0].x, tableauSnake[0].y, tableauSnake[0].dx, tableauSnake[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche du BAS
    if(e.keyCode == 40){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnake[0].dx = 0;
        tableauSnake[0].dy = vitesse;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnake[0].historique.push(new Historique (tableauSnake[0].x, tableauSnake[0].y, tableauSnake[0].dx, tableauSnake[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 10);
    }
    //Barre d'espace
    if(e.keyCode == 32){
        e.preventDefault();
        //On met le jeux en pause
        alert("Pause");
    }
    //Echap
    if(e.keyCode == 27){
        e.preventDefault();
        
        if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
            choixCouleurSerpent = '';
            divCouleurJungle.style.border = "1px solid white";
        }
        if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
            xVagues = 0;
            yVagues = 0;
        }
        
        //On revient au menu principal
        divOverlay.style.display = "flex";
        
        tableauSnake = [];
        relancerSnake ();
        tableauSnakePC = [];
    }
}

/////////////////TEST snake PC a virer

//Je dois creer mes evenements grace a cette fonction car cette derniere sera rappellee a chaques fois qu'un evenement s'est declenche puis a ete desactive
function EvenementsPC (){
    document.addEventListener("keydown", EventKeydownPC);
}

//J'ai du creer une fonction nommee pour pouvoir y acceder lors de la suppression d'evenement. (impossible a faire avec une fonction anonyme)
function EventKeydownPC(e) {
    
    //Fleche de GAUCHE
    if(e.keyCode == 65){
        e.preventDefault();
        
        //On modifie la direction pour la tete
        tableauSnakePC[0].dx = -vitesse;
        tableauSnakePC[0].dy = 0;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche du HAUT
    if(e.keyCode == 87){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnakePC[0].dx = 0;
        tableauSnakePC[0].dy = -vitesse;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));

        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche de DROITE
    if(e.keyCode == 68){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnakePC[0].dx = vitesse;
        tableauSnakePC[0].dy = 0;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 100);
    }
    //Fleche du BAS
    if(e.keyCode == 83){
        e.preventDefault();

        //On modifie la direction pour la tete
        tableauSnakePC[0].dx = 0;
        tableauSnakePC[0].dy = vitesse;
        
        //On stocke en memoire les coordonnees et la direction juste avant de changer de direction
        tableauSnakePC[0].historique.push(new Historique (tableauSnakePC[0].x, tableauSnakePC[0].y, tableauSnakePC[0].dx, tableauSnakePC[0].dy));
        
        document.removeEventListener('keydown', EventKeydown);
        setTimeout(Evenements, 10);
    }
    //Barre d'espace
    if(e.keyCode == 32){
        e.preventDefault();
        //On met le jeux en pause
        alert("Pause");
    }
}

/////////////////////FIN SNAKE TEST


///////////////////////// Evenements clic //////////////////////////////////////

//Si on clic sur Recommencer
divRecommencer.addEventListener("click", function() {
    //On re-initialise les parametres du snake comme au depart
    //clearInterval(intervalSnake);
    relancerSnake ();
    
    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
        xTornade = -200;
        yTornade = -50;
    }
    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
        xVagues = 0;
        yVagues = 0;
        directionVagues = "baisse";
    }
    
    
    
    if(choixTypeJeux == "battle"){
        relancerSnakePC ();
    }
    
    //intervalSnake = setInterval(AnimerSnake, tempsRafraichissement);
});

//Si on clic sur Menu principal
divMenuPrincipal.addEventListener("click", function() {
    
    if((choixCouleurSerpent == "couleurJungle") && (choixTypeJeux == "classique")){
        choixCouleurSerpent = '';
        divCouleurJungle.style.border = "1px solid white";
    }
    if((choixCouleurSerpent == "couleurEau") && (choixTypeJeux == "classique")){
        xVagues = 0;
        yVagues = 0;
    }
    
    //On affiche le panneaux de choix des parametres
    divOverlay.style.display = "flex";
    
    tableauSnake = [];
    relancerSnake ();
    tableauSnakePC = [];
});


//////////////Clic sur le type de jeux Classique///////////////
divTypeJeuxClassique.addEventListener("click", function() {
    //on selectionne le type de jeux classique
    divTypeJeuxClassique.style.border = "3px solid black";
    //On met a jour notre variable
    choixTypeJeux = "classique";
    //On retire la selection de jeux battle
    divTypeJeuxBattle.style.border = "1px solid black";
    //Appel de la fonction de test au cas on on soit le dernier choix a avoir ete fait
    testReady();
});
divTypeJeuxBattle.addEventListener("click", function() {
    //on selectionne le type de jeux classique
    divTypeJeuxBattle.style.border = "3px solid black";
    //On met a jour notre variable
    choixTypeJeux = "battle";
    //On retire la selection de jeux battle
    divTypeJeuxClassique.style.border = "1px solid black";
    testReady();
});

///////////////Clic sur le type de serpent////////////
divTypeSerpentVipere.addEventListener("click", function() {
    divTypeSerpentVipere.style.border = "3px solid black";
    choixTypeSerpent = "vipere";
    divTypeSerpentConstricteur.style.border = "1px solid black";
    testReady();
});
divTypeSerpentConstricteur.addEventListener("click", function() {
    divTypeSerpentConstricteur.style.border = "3px solid black";
    choixTypeSerpent = "constricteur";
    divTypeSerpentVipere.style.border = "1px solid black";
    testReady();
});

///////////////Clic sur la couleur du serpent////////////
divCouleurSable.addEventListener("click", function() {
    divCouleurSable.style.border = "3px solid black";
    choixCouleurSerpent = "couleurSable";
    divCouleurEau.style.border = "1px solid white";
    divCouleurJungle.style.border = "1px solid white";
    testReady();
});
divCouleurJungle.addEventListener("click", function() {
    divCouleurJungle.style.border = "3px solid black";
    choixCouleurSerpent = "couleurJungle";
    divCouleurSable.style.border = "1px solid white";
    divCouleurEau.style.border = "1px solid white";
    testReady();
});
divCouleurEau.addEventListener("click", function() {
    divCouleurEau.style.border = "3px solid black";
    choixCouleurSerpent = "couleurEau";
    divCouleurSable.style.border = "1px solid white";
    divCouleurJungle.style.border = "1px solid white";
    testReady();
});


///////////////Clic sur la difficulte////////////
divGirls.addEventListener("click", function() {
    divGirls.style.border = "3px solid black";
    choixDifficulte = "girls";
    divDifficile.style.border = "1px solid white";
    divMoyen.style.border = "1px solid white";
    divFacile.style.border = "1px solid white";
    testReady();
});
divFacile.addEventListener("click", function() {
    divFacile.style.border = "3px solid black";
    choixDifficulte = "facile";
    divDifficile.style.border = "1px solid white";
    divGirls.style.border = "1px solid white";
    divMoyen.style.border = "1px solid white";
    testReady();
});
divMoyen.addEventListener("click", function() {
    divMoyen.style.border = "3px solid black";
    choixDifficulte = "moyen";
    divDifficile.style.border = "1px solid white";
    divFacile.style.border = "1px solid white";
    divGirls.style.border = "1px solid white";
    testReady();
});
divDifficile.addEventListener("click", function() {
    divDifficile.style.border = "3px solid black";
    choixDifficulte = "difficile";
    divGirls.style.border = "1px solid white";
    divFacile.style.border = "1px solid white";
    divMoyen.style.border = "1px solid white";
    testReady();
});


//Click sur le reset des meilleurs scores
divReinitScores.addEventListener("click", function() {

    if(choixTypeJeux == "classique"){
        setCookie("MeilleurScoreSnakeClassique", "0");
        divMeilleurScore.innerHTML = 'Meilleur score: ' + getMeilleurScore('classique');
    }
    else if (choixTypeJeux == "battle"){
        setCookie("MeilleurScoreSnakeBattle", "0/0");
        divMeilleurScore.innerHTML = 'Victoires / Defaites: ' + getMeilleurScore('battle');
    }
});



////////////////////////// Fin EVENEMENTS //////////////////////////////////////


////// Premier lancement ///////

//Initialise tous les parametres du snake pour une nouvelle partie
relancerSnake ();

//On met en place nos evenements pour la premiere fois
Evenements();

//On lance notre snake
//AnimerSnake();
var intervalSnake = setInterval(AnimerSnake, tempsRafraichissement);
