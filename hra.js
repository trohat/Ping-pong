var hra = {};
hra.micek = {
	ja: document.getElementById("micek"),
	rychlost: 5,
	smerX: Math.random() > 0.5 ? -3 : 3,
	smerY: Math.random() > 0.5 ? -0.5 : 0.5,
};

hra.micek.posX = hra.micek.ja.offsetLeft;
hra.micek.posY = hra.micek.ja.offsetTop;
hra.micek.sirka = hra.micek.ja.offsetWidth;
hra.micek.vyska = hra.micek.ja.offsetHeight;

hra.hriste = {
	ja: document.getElementById("hriste"),
};

hra.hriste.sirka = hra.hriste.ja.clientWidth;
hra.hriste.vyska = hra.hriste.ja.clientHeight;

hra.interval = 0;
hra.odstartovana = false;

hra.hraj = function(){
	console.log ("hrajem");
	hra.pohniMickem();
	// todo - pohniPalkami
}; // cyklus spuštěný setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	tlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto!";
	if (hra.odstartovana)
		hra.interval = setInterval (hra.hraj, 1);
	else
		clearInterval(hra.interval);
}; // odstartuje hru - nebo ji zastaví, pokud je už ostartovaná

var tlacitko = document.getElementById("start");

tlacitko.addEventListener("click", hra.zmenStav);

hra.pohniMickem = function() {
	var mic = hra.micek;
	if (mic.posX < 0) mic.smerX = -mic.smerX;
	if (mic.posX + mic.sirka > hra.hriste.sirka) mic.smerX = -mic.smerX;
	if (mic.posY < 0) mic.smerY = -mic.smerY;
	if (mic.posY + mic.vyska > hra.hriste.vyska) mic.smerY = -mic.smerY;
	mic.posX += mic.smerX;
	mic.posY += mic.smerY;
	mic.ja.style.left = mic.posX+"px";
	mic.ja.style.top = mic.posY+"px";
}

/*function zacniHru(){
	hra.micek.posX = hra.micek.ja.offsetLeft;
	hra.micek.posY = hra.micek.ja.offsetTop;
	hra.micek.sirka = hra.micek.ja.offsetWidth;
	hra.micek.vyska = hra.micek.ja.offsetHeight;
}

zacniHru();*/
