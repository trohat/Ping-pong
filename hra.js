const HRAJEM = true; 
// prepina ruzne mody testovani
// vymazat ve finalni verzi

var hra = {

	micek: {
		rychlost: 5,
		smerX: Math.random() > 0.5 ? -3 : 3,
		smerY: Math.random() > 0.5 ? -0.5 : 0.5,
		vratNaZacatek() {
			this.posX = this.startposX;
			this.posY = this.startposY;
			this.smerX = Math.random() > 0.5 ? -3 : 3; 
			this.smerY = Math.random() > 0.5 ? -0.5 : 0.5; 
		}
	},

	palka1: {},
	palka2: {},
	hriste: {},
	klavesy: {}, //stisknute klavesy
	skore1: {
		hodnota: 0,
		kde: document.getElementById("skore1"),
		nastav(kolik) {
			this.hodnota = kolik;
			this.kde.innerHTML = kolik;
		}
	},
	skore2: {
		hodnota: 0,
		kde: document.getElementById("skore2"),
		nastav(kolik) {
			this.hodnota = kolik;
			this.kde.innerHTML = kolik;
		}
	},
	interval: 0,
	ostartovana: false	
}; // globalni objekt ve kterem jsou schovane vsechny mensi objekty

function nastavPoziciObjektu (nepouzita_promenna_objekt, idcko) {   
	var objekt = hra[idcko]; // objekt nakonec zvladnu precist pomoci idcka, takze nemusel byt v parametrech
	objekt.ja = document.getElementById(idcko),
	objekt.posX = objekt.ja.offsetLeft;
	objekt.posY = objekt.ja.offsetTop;
	objekt.sirka = objekt.ja.offsetWidth;
	objekt.vyska = objekt.ja.offsetHeight;
	objekt.startposX = objekt.posX;
	objekt.startposY = objekt.posY;
} // pozice micku a palek
// idcko je cesky vyraz pro slovo id - cestina mi pomaha vyhnout se klicovym slovum

function nastavPoziciHriste(hriste) {
	hriste.ja = document.getElementById("hriste");
	hriste.sirka = hriste.ja.clientWidth;
	hriste.vyska = hriste.ja.clientHeight;
} // potrebuje samostatnou funkci, protoze pouziva clientWidth misto offsetWidth

hra.hraj = function(){
	hra.pohniMickem();
	hra.pohniPalkami();
	//if (hra.klavesy["x"]) { hra.zmenStav(); }
}; // cyklus spusteny setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	startTlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto!";
	console.log(hra.interval);
	if (hra.odstartovana) {
		hra.interval = setInterval (hra.hraj, 1);
	} else {
		clearInterval(hra.interval);
	}
}; // odstartuje hru - nebo ji zastavi, pokud je uz ostartovana

hra.pohniMickem = function() {
	const mic = hra.micek,
		 palka1 = hra.palka1,
		 palka2 = hra.palka2;
	if (mic.posX < palka1.posX + palka1.sirka &&
		mic.posY + mic.vyska > palka1.posY &&
		mic.posY < palka1.posY + palka1.vyska
		) { // odraz od leve palky
		mic.smerX = -mic.smerX;
	} else if (mic.posX < 0) { // leva zed
		hra.skore2.nastav (++hra.skore2.hodnota);
		mic.vratNaZacatek();
	}	
	if (mic.posX + mic.sirka > palka2.posX &&
		mic.posY + mic.vyska > palka2.posY &&
		mic.posY < palka2.posY + palka2.vyska
		) {  // odraz od prave palky
		mic.smerX = -mic.smerX;
	} else if (mic.posX + mic.sirka > hra.hriste.sirka) { // prava zed
		hra.skore1.nastav (++hra.skore1.hodnota);
		mic.vratNaZacatek();
	}
	if (mic.posY < 0) { // odraz od horni zdi
		mic.smerY = -mic.smerY;
	}
	if (mic.posY + mic.vyska > hra.hriste.vyska) { // odraz od spodni zdi
		mic.smerY = -mic.smerY;
	}
	mic.posX += mic.smerX;
	mic.posY += mic.smerY;
	mic.ja.style.left = mic.posX+"px";
	mic.ja.style.top = mic.posY+"px";
	mic.ja.style.display = "block";
};

hra.pohniPalkami = function() {
	const klavesy = hra.klavesy,
		  palka1 = hra.palka1,
		  palka2 = hra.palka2;
	if (klavesy["w"] || klavesy["W"]) { // leva palka nahoru
		palka1.posY -= 2;
		if (palka1.posY < 0) { // pokud je uz na maximu
			palka1.posY = 0; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	if (klavesy["s"] || klavesy["S"]) { // leva palka dolu
		palka1.posY += 2;
		if (palka1.posY > hra.hriste.vyska - palka1.vyska) { // pokud je uz na maximu
			palka1.posY = hra.hriste.vyska - palka1.vyska; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	if (klavesy["ArrowUp"]) { // prava nahoru
		palka2.posY -= 2;
		if (palka2.posY < 0) {
			palka2.posY = 0; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
	if (klavesy["ArrowDown"]) { // prava dolu
		palka2.posY += 2;
		if (palka2.posY > hra.hriste.vyska - palka2.vyska) {
			palka2.posY = hra.hriste.vyska - palka2.vyska; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
};

hra.restart = function() { // vse odznovu
	if (hra.odstartovana) {
		clearInterval (hra.interval);
		hra.odstartovana = false;
	}
	startTlacitko.innerHTML = "Start!";
	hra.skore1.nastav(0);
	hra.skore2.nastav(0);
	hra.micek.vratNaZacatek();
	hra.micek.ja.style.display = "none";
}

function zacniHru() {
	nastavPoziciHriste (hra.hriste);
	nastavPoziciObjektu (hra.micek, "micek");
	nastavPoziciObjektu (hra.palka1, "palka1");
	nastavPoziciObjektu (hra.palka2, "palka2");
}

zacniHru();

const startTlacitko = document.getElementById("start");
const resetTlacitko = document.getElementById("reset");

startTlacitko.addEventListener("click", hra.zmenStav);
resetTlacitko.addEventListener("click", hra.restart);

document.addEventListener("keydown", function(event) {
	hra.klavesy[event.key] = true;
	//if (event.key === "x") hra.zmenStav(); //zrusit !!
});

document.addEventListener("keyup", function(event) {
	hra.klavesy[event.key] = false;
});

//asi by to šlo jeste lepe pospojovat objektove nebo pomocí ES6 trid (napr. bych vyuzil dedicnost -
//nastavPozici by mohla byt metoda predka a ostatni by z ní dedili, a treba hriste by si ji predefinovalo
//ale vzhledem k rozsahu programu mi prijde tohle fajn, protože je to prehledne