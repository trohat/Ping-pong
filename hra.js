const HRAJEM = false; 
// přepíná různé módy testování
// vymazat ve finální verzi

var hra = {

	micek: {
		rychlost: 5,
		smerX: Math.random() > 0.5 ? -3 : 3,
		smerY: Math.random() > 0.5 ? -0.5 : 0.5,
		vratNaZacatek() {
			this.posX = this.startposX;
			this.posY = this.startposY;
			this.smerX = Math.random() > 0.5 ? -3 : 3; // vymaz
			this.smerY = Math.random() > 0.5 ? -0.5 : 0.5; // vymaz
		}
		},

	palka1: {},
	palka2: {},
	hriste: {},
	skore1: {
		hodnota: 0,
		kde: document.getElementById("skore1")
	},
	skore2: {
		hodnota: 0,
		kde: document.getElementById("skore2")
	},
	interval: 0,
	ostartovana: false	
}; // globální objekt ve kterém jsou schované všechny menší objekty

function nastavPoziciObjektu (nepouzita_promenna_objekt, idcko) {   
	var objekt = hra[idcko];
	objekt.ja = document.getElementById(idcko),
	objekt.posX = objekt.ja.offsetLeft;
	objekt.posY = objekt.ja.offsetTop;
	objekt.sirka = objekt.ja.offsetWidth;
	objekt.vyska = objekt.ja.offsetHeight;
	if (idcko === "micek") {
		objekt.startposX = objekt.posX;
		objekt.startposY = objekt.posY;
	}
} // pozice míčků a pálek
// idcko je český výraz pro slovo id - čeština mi pomáhá vyhnout se klíčovým slovům

function nastavPoziciHriste(hriste) {
	hriste.ja = document.getElementById("hriste");
	hriste.sirka = hriste.ja.clientWidth;
	hriste.vyska = hriste.ja.clientHeight;
} // potřebuje samostatnou funkci, protože používá clientWidth místo offsetWidth

hra.hraj = function(){
	console.log ("hrajem");
	hra.pohniMickem();
	// todo - pohniPalkami
}; // cyklus spuštěný setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	tlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto!";
	if (hra.odstartovana) {
		hra.interval = setInterval (hra.hraj, 1);
	} else {
		clearInterval(hra.interval);
	}
}; // odstartuje hru - nebo ji zastaví, pokud je už ostartovaná

hra.pohniMickem = function() {
	const mic = hra.micek;
	if (mic.posX < 0) {
		if (HRAJEM) { // vymazat a nechat jen IF část
			hra.skore2.kde.innerHTML = ++hra.skore2.hodnota;
			mic.vratNaZacatek();
		} else {
			mic.smerX = -mic.smerX;
		}
	}	
	if (mic.posX + mic.sirka > hra.hriste.sirka) {
		if (HRAJEM) { // vymazat a nechat jen IF část
			hra.skore1.kde.innerHTML = ++hra.skore1.hodnota;
			mic.vratNaZacatek();
		} else {
			mic.smerX = -mic.smerX;
		}
	}
	if (mic.posY < 0) {
		mic.smerY = -mic.smerY;
	}
	if (mic.posY + mic.vyska > hra.hriste.vyska) {
		mic.smerY = -mic.smerY;
	}
	mic.posX += mic.smerX;
	mic.posY += mic.smerY;
	mic.ja.style.left = mic.posX+"px";
	mic.ja.style.top = mic.posY+"px";
}

function zacniHru() {
	nastavPoziciHriste (hra.hriste);
	nastavPoziciObjektu (hra.micek, "micek");
	nastavPoziciObjektu (hra.palka1, "palka1");
	nastavPoziciObjektu (hra.palka2, "palka2");
}

zacniHru();

const tlacitko = document.getElementById("start");

tlacitko.addEventListener("click", hra.zmenStav);