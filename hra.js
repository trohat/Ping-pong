const HRAJEM = true;
// testovaci konstanta

const SIRKA = 43;
// kam az testovat sirku palky 
// (odviji se od max rychlosti micku)

const POCX = 3; // pocatecni rychlost X
const POCY = 0; // pocatecni rychlost Y

var hra = {

	micek: {
		rychlost: Math.sqrt(POCX**2 + POCY**2),
		smerX: Math.random() > 0.5 ? -POCX : POCX,
		smerY: Math.random() > 0.5 ? -POCY : POCY,

		odraz (palka) {
			let stredM = this.posY + this.vyska/2;
			let vrsekP = palka.posY;
			let stredP = palka.posY + palka.vyska/2; 
			let uhel = (stredP - stredM) / (stredP - vrsekP);
			uhel *= 75;
			uhel = uhel * Math.PI / 180;
			this.smerX = Math.cos(uhel) * this.rychlost;
			this.smerY = Math.sin(uhel) * this.rychlost;
			this.smerY = - this.smerY; // kvuli logice v goniometrii je tohle az na konci
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
	ostartovana: false,

	vykresli (objekt) {
		objekt.ja.style.left = objekt.posX+"px"; 
		objekt.ja.style.top = objekt.posY+"px";
	},

	vratNaZacatek (objekt) {
			objekt.posX = objekt.startPosX;
			objekt.posY = objekt.startPosY;
			if ("smerX" in objekt) {
				objekt.smerX = Math.random() > 0.5 ? -POCX : POCX; 
				objekt.smerY = Math.random() > 0.5 ? -POCY : POCY;
			}
			hra.vykresli(objekt);
	}	 
}; // globalni objekt ve kterem jsou schovane vsechny mensi objekty

function nastavPoziciObjektu (nepouzita_promenna_objekt, idcko) {   
	var objekt = hra[idcko]; // objekt nakonec zvladnu precist pomoci idcka, takze nemusel byt v parametrech
	objekt.ja = document.getElementById(idcko),
	objekt.posX = objekt.ja.offsetLeft;
	objekt.posY = objekt.ja.offsetTop;
	objekt.sirka = objekt.ja.offsetWidth;
	objekt.vyska = objekt.ja.offsetHeight;
	objekt.startPosX = objekt.posX;
	objekt.startPosY = objekt.posY;
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
	if (hra.klavesy["x"]) { hra.restart(); hra.zmenStav(); } // testovaci radek
}; // cyklus spusteny setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	startTlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto!";
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
	if (((mic.posX < palka1.posX + palka1.sirka &&
		mic.posX >= palka1.posX + palka1.sirka - SIRKA &&
		mic.smerX < 0 ) || (
		mic.posX + mic.sirka > palka1.posX &&
		mic.posX + mic.sirka <= palka1.posX + SIRKA &&
		mic.smerX > 0 )) &&		
		mic.posY + mic.vyska > palka1.posY &&
		mic.posY < palka1.posY + palka1.vyska) { 
		mic.odraz(palka1);
	} else if (mic.posX < 0) {
		if (HRAJEM) {   //vymaz (proto to neni uvnitr odsazene)
		hra.skore2.nastav (++hra.skore2.hodnota);
		hra.vratNaZacatek(mic);
		} else { // vymaz
			mic.smerX = -mic.smerX; // vymaz
		} // vymaz
	}	
	if (((mic.posX + mic.sirka > palka2.posX &&
		mic.posX + mic.sirka <= palka2.posX + SIRKA &&
		mic.smerX > 0 ) || (
		mic.posX < palka2.posX + palka2.sirka &&
		mic.posX >= palka2.posX + palka2.sirka - SIRKA &&
		mic.smerX < 0 )) &&		
		mic.posY + mic.vyska > palka2.posY &&
		mic.posY < palka2.posY + palka2.vyska) {  
		mic.odraz(palka2);
		mic.smerX = -mic.smerX; 
	} else if (mic.posX + mic.sirka > hra.hriste.sirka) { 
		if (HRAJEM) {   //vymaz
		hra.skore1.nastav (++hra.skore1.hodnota);
		hra.vratNaZacatek(mic);
		} else { // vymaz
			mic.smerX = -mic.smerX; // vymaz
		} // vymaz
	}
	if (mic.posY < 0) { 
		mic.smerY = -mic.smerY;
	}
	if (mic.posY + mic.vyska > hra.hriste.vyska) { 
		mic.smerY = -mic.smerY;
	}
	mic.posX += mic.smerX;
	mic.posY += mic.smerY;
	hra.vykresli(mic);
};

hra.pohniPalkami = function() {
	const klavesy = hra.klavesy,
		  palka1 = hra.palka1,
		  palka2 = hra.palka2;
	if (klavesy["w"] || klavesy["W"]) { 
		palka1.posY -= 2;
		if (palka1.posY < 0) { 
			palka1.posY = 0; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	if (klavesy["s"] || klavesy["S"]) { 
		palka1.posY += 2;
		if (palka1.posY > hra.hriste.vyska - palka1.vyska) { 
			palka1.posY = hra.hriste.vyska - palka1.vyska; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	/*if (klavesy["a"] || klavesy["A"]) { 
		palka1.posX -= 2;
		if (palka1.posX < 0) { 
			palka1.posX = 0; 
		}
		palka1.ja.style.left = palka1.posX+"px";
	}
	if (klavesy["d"] || klavesy["D"]) { 
		palka1.posX += 2;
		if (palka1.posX > hra.hriste.sirka - palka1.sirka) { 
			palka1.posX = hra.hriste.sirka - palka1.sirka; 
		}
		palka1.ja.style.left = palka1.posX+"px";
	}*/
	if (klavesy["ArrowUp"]) { 
		palka2.posY -= 2;
		if (palka2.posY < 0) {
			palka2.posY = 0; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
	if (klavesy["ArrowDown"]) { 
		palka2.posY += 2;
		if (palka2.posY > hra.hriste.vyska - palka2.vyska) {
			palka2.posY = hra.hriste.vyska - palka2.vyska; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
	/*if (klavesy["ArrowLeft"]) { 
		palka2.posX -= 2;
		if (palka2.posX < 0) {
			palka2.posX = 0; 
		}
		palka2.ja.style.left = palka2.posX+"px";
	}
	if (klavesy["ArrowRight"]) { 
		palka2.posX += 2;
		if (palka2.posX > hra.hriste.sirka - palka2.sirka) {
			palka2.posX = hra.hriste.sirka - palka2.sirka; 
		}
		palka2.ja.style.left = palka2.posX+"px";
	}*/
};

hra.restart = function() { // vse odznovu
	if (hra.odstartovana) {
		clearInterval (hra.interval);
		hra.odstartovana = false;
	}
	startTlacitko.innerHTML = "Start!";
	hra.skore1.nastav(0);
	hra.skore2.nastav(0);
	hra.vratNaZacatek(hra.micek);
	hra.vratNaZacatek(hra.palka1);
	hra.vratNaZacatek(hra.palka2);
}

hra.zacniHru = function() {
	nastavPoziciHriste (hra.hriste);
	nastavPoziciObjektu (hra.micek, "micek");
	nastavPoziciObjektu (hra.palka1, "palka1");
	nastavPoziciObjektu (hra.palka2, "palka2");
}

hra.zacniHru();

const startTlacitko = document.getElementById("start");
const resetTlacitko = document.getElementById("reset");

startTlacitko.addEventListener("click", hra.zmenStav);
resetTlacitko.addEventListener("click", hra.restart);

document.addEventListener("keydown", function(event) {
	hra.klavesy[event.key] = true;
});

document.addEventListener("keyup", function(event) {
	hra.klavesy[event.key] = false;
});

//asi by to šlo jeste lepe pospojovat objektove nebo pomocí ES6 trid (napr. bych vyuzil dedicnost -
//nastavPozici by mohla byt metoda predka a ostatni by z ní dedili, a treba hriste by si ji predefinovalo
//ale vzhledem k rozsahu programu mi prijde tohle fajn, protože je to prehledne