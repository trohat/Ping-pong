const SIRKA = 45;
// kam az testovat sirku palky pri odrazu micku 
// (odviji se od max rychlosti micku)

const POCX = 3; // pocatecni rychlost micku smer X
const POCY = 0; // pocatecni rychlost micku smer Y

let hra = {

	micek: {
		rychlost: Math.sqrt(POCX**2 + POCY**2),
		smerX: Math.random() > 0.5 ? -POCX : POCX,
		smerY: Math.random() > 0.5 ? -POCY : POCY,

		odraz (palka) { // vypocet, jak se ma micek odrazit od palky
			let stredM = this.posY + this.vyska/2;
			let vrsekP = palka.posY + palka.vyska + this.vyska/2;
			let stredP = palka.posY + palka.vyska/2; 
			let uhel = (stredP - stredM) / (vrsekP - stredP); //vypocet uhlu odrazu
			uhel *= 75; // max uhel odrazu = 75 stupnu
			uhel = uhel * Math.PI / 180; // prevod na radiany
			this.smerX = Math.cos(uhel) * this.rychlost;
			this.smerY = Math.sin(uhel) * this.rychlost;
			this.smerY = - this.smerY; // spravne nastaveni smeru - kvuli logice v goniometrii je to az na konci
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
	ai1: false,
	ai2: false, 

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
		mic.odraz(palka1);  // odraz od palky 1
	} else if (mic.posX < 0) {
		hra.skore2.nastav (++hra.skore2.hodnota);
		hra.vratNaZacatek(mic); // leva zed (novy mic + zvyseni skore)
	}	
	if (((mic.posX + mic.sirka > palka2.posX &&
		mic.posX + mic.sirka <= palka2.posX + SIRKA &&
		mic.smerX > 0 ) || (
		mic.posX < palka2.posX + palka2.sirka &&
		mic.posX >= palka2.posX + palka2.sirka - SIRKA &&
		mic.smerX < 0 )) &&		
		mic.posY + mic.vyska > palka2.posY &&
		mic.posY < palka2.posY + palka2.vyska) {  
		mic.odraz(palka2); // odraz od palky 2
		mic.smerX = -mic.smerX; // smer bude opacny nez vysel z goniometriceho vypoctu
	} else if (mic.posX + mic.sirka > hra.hriste.sirka) { 
		hra.skore1.nastav (++hra.skore1.hodnota);
		hra.vratNaZacatek(mic); // prava zed (novy mic + zvyseni skore)
	}
	if (mic.posY < 0) { // horni zed
		mic.smerY = -mic.smerY;
	}
	if (mic.posY + mic.vyska > hra.hriste.vyska) { // dolni zed
		mic.smerY = -mic.smerY;
	}
	mic.posX += mic.smerX;
	mic.posY += mic.smerY;
	hra.vykresli(mic);
};

hra.pouzijAI1 = function () { // umela inteligence pro palku 1
	const pulPalky = hra.palka1.vyska / 2;
	const pulHriste = hra.hriste.sirka / 2;
	if (hra.micek.posY + hra.micek.vyska < hra.palka1.posY + pulPalky &&
		hra.micek.posX + hra.micek.sirka < pulHriste
		) {
		hra.klavesy["W"] = true;
	} else {
		hra.klavesy["W"] = false;
	}
	if (hra.micek.posY > hra.palka1.posY + pulPalky &&
		hra.micek.posX + hra.micek.sirka < pulHriste
		) {
		hra.klavesy["S"] = true;
	} else {
		hra.klavesy["S"] = false;
	}
};

hra.pouzijAI2 = function () { // umela inteligence pro palku 2
	const pulPalky = hra.palka2.vyska / 2;
	const pulHriste = hra.hriste.sirka / 2;
	if (hra.micek.posY + hra.micek.vyska < hra.palka2.posY + pulPalky
		&& hra.micek.posX > pulHriste) {
		hra.klavesy["ArrowUp"] = true;
	} else {
		hra.klavesy["ArrowUp"] = false;
	}
	if (hra.micek.posY > hra.palka2.posY + pulPalky
		&& hra.micek.posX > pulHriste) {
		hra.klavesy["ArrowDown"] = true;
	} else {
		hra.klavesy["ArrowDown"] = false;
	}
};

hra.pohniPalkami = function() {
	const klavesy = hra.klavesy,
		  palka1 = hra.palka1,
		  palka2 = hra.palka2;
	if (klavesy["w"] || klavesy["W"]) { // leva palka nahoru
		palka1.posY -= 2;
		if (palka1.posY < 0) { 
			palka1.posY = 0; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	if (klavesy["s"] || klavesy["S"]) {    // leva palka dolu
		palka1.posY += 2;
		if (palka1.posY > hra.hriste.vyska - palka1.vyska) { 
			palka1.posY = hra.hriste.vyska - palka1.vyska; 
		}
		palka1.ja.style.top = palka1.posY+"px";
	}
	if (klavesy["ArrowUp"]) { // prava palka nahoru
		palka2.posY -= 2;
		if (palka2.posY < 0) {
			palka2.posY = 0; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
	if (klavesy["ArrowDown"]) { // prava palka dolu
		palka2.posY += 2;
		if (palka2.posY > hra.hriste.vyska - palka2.vyska) {
			palka2.posY = hra.hriste.vyska - palka2.vyska; 
		}
		palka2.ja.style.top = palka2.posY+"px";
	}
};

function nastavPoziciObjektu (idcko) {   
	const objekt = hra[idcko]; 
	objekt.ja = document.getElementById(idcko),
	objekt.posX = objekt.ja.offsetLeft;
	objekt.posY = objekt.ja.offsetTop;
	objekt.sirka = objekt.ja.offsetWidth;
	objekt.vyska = objekt.ja.offsetHeight;
	objekt.startPosX = objekt.posX;
	objekt.startPosY = objekt.posY;
} // nastaveni uvodnich rozmeru pro micek a palky
// idcko je cesky vyraz pro slovo id - cestina mi pomaha vyhnout se klicovym slovum

function nastavPoziciHriste(hriste) {
	hriste.ja = document.getElementById("hriste");
	hriste.sirka = hriste.ja.clientWidth;
	hriste.vyska = hriste.ja.clientHeight;
} // nastaveni uvodnich rozmeru pro hriste
// potrebuje samostatnou funkci, protoze pouziva clientWidth misto offsetWidth

hra.zacniHru = function() {
	nastavPoziciHriste (hra.hriste);
	nastavPoziciObjektu ("micek");
	nastavPoziciObjektu ("palka1");
	nastavPoziciObjektu ("palka2");
}

hra.hraj = function(){
	hra.pohniMickem();
	if (hra.ai1) { hra.pouzijAI1(); }
	if (hra.ai2) { hra.pouzijAI2(); }
	hra.pohniPalkami();
}; // cyklus spusteny setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	startTlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto";
	if (hra.odstartovana) {
		hra.interval = setInterval (hra.hraj, 1);
	} else {
		clearInterval(hra.interval);
	}
}; // odstartuje hru - nebo ji zastavi, pokud je uz ostartovana

hra.restart = function() { // vse odznovu
	if (hra.odstartovana) {
		clearInterval (hra.interval);
		hra.odstartovana = false;
	}
	startTlacitko.innerHTML = "Start";
	hra.skore1.nastav(0);
	hra.skore2.nastav(0);
	hra.vratNaZacatek(hra.micek);
	hra.vratNaZacatek(hra.palka1);
	hra.vratNaZacatek(hra.palka2);
}

hra.zapojAI1 = function () {  
	hra.ai1 = !hra.ai1;
	ai1Tlacitko.innerHTML = hra.ai1 ? "Vrať hráče 1<br>do hry" : "Zapni počítač místo hráče 1";
	let hrac = document.getElementById("hrac1");
	let skore = document.getElementById("skore1");
	if (hra.ai1) {
		hrac.innerHTML = "Počítač"
		hrac.style.color = "grey";
		skore.style.color = "grey";
	} else {
		hrac.innerHTML = "Hráč 1"
		hrac.style.color = "black";
		skore.style.color = "black";
	}	
};

hra.zapojAI2 = function () {  
	hra.ai2 = !hra.ai2;
	ai2Tlacitko.innerHTML = hra.ai2 ? "Vrať hráče 2<br>do hry" : "Zapni počítač místo hráče 2";
	let hrac = document.getElementById("hrac2");
	let skore = document.getElementById("skore2");
	if (hra.ai2) {
		hrac.innerHTML = "Počítač"
		hrac.style.color = "grey";
		skore.style.color = "grey";
	} else {
		hrac.innerHTML = "Hráč 2"
		hrac.style.color = "black";
		skore.style.color = "black";
	}	
};

const startTlacitko = document.getElementById("start");
const resetTlacitko = document.getElementById("reset");
const ai1Tlacitko = document.getElementById("ai1");
const ai2Tlacitko = document.getElementById("ai2");

startTlacitko.addEventListener("click", hra.zmenStav); // start nebo stop
resetTlacitko.addEventListener("click", hra.restart); // restart cele hry
ai1Tlacitko.addEventListener("click", hra.zapojAI1);  // umela inteligence pro palku 1
ai2Tlacitko.addEventListener("click", hra.zapojAI2);  // umela inteligence pro palku 2


document.addEventListener("keydown", function(event) {
	hra.klavesy[event.key] = true;
});

document.addEventListener("keyup", function(event) {
	hra.klavesy[event.key] = false;
});

hra.zacniHru();
