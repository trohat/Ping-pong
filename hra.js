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
		kde: document.getElementById("skore1")
	},
	skore2: {
		hodnota: 0,
		kde: document.getElementById("skore2")
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
	if (idcko === "micek") {
		objekt.startposX = objekt.posX;
		objekt.startposY = objekt.posY;
	}
} // pozice micku a palek
// idcko je cesky vyraz pro slovo id - cestina mi pomaha vyhnout se klicovym slovum

function nastavPoziciHriste(hriste) {
	hriste.ja = document.getElementById("hriste");
	hriste.sirka = hriste.ja.clientWidth;
	hriste.vyska = hriste.ja.clientHeight;
} // potrebuje samostatnou funkci, protoze pouziva clientWidth misto offsetWidth

hra.hraj = function(){
	console.log (hra.klavesy); // vymazat
	hra.pohniMickem();
	hra.pohniPalkami();
}; // cyklus spusteny setIntervalem ve funkci zmenStav

hra.zmenStav = function(){
	hra.odstartovana = !hra.odstartovana;
	tlacitko.innerHTML = hra.odstartovana ? "Stop" : "Stopnuto!";
	if (hra.odstartovana) {
		hra.interval = setInterval (hra.hraj, 1);
	} else {
		clearInterval(hra.interval);
	}
}; // odstartuje hru - nebo ji zastavi, pokud je uz ostartovana

hra.pohniMickem = function() {
	const mic = hra.micek;
	if (mic.posX < 0) {
		if (HRAJEM) { // vymazat a nechat jen IF cast
			hra.skore2.kde.innerHTML = ++hra.skore2.hodnota;
			mic.vratNaZacatek();
		} else {
			mic.smerX = -mic.smerX; // nedojde k chybe a pripocitani bodu, micek se odrazi zpatky
		}
	}	
	if (mic.posX + mic.sirka > hra.hriste.sirka) {
		if (HRAJEM) { // vymazat a nechat jen IF část
			hra.skore1.kde.innerHTML = ++hra.skore1.hodnota;
			mic.vratNaZacatek();
		} else {
			mic.smerX = -mic.smerX; // nedojde k chybe, micek se odrazi zpatky (varianta pro testovani)
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
};

function zacniHru() {
	nastavPoziciHriste (hra.hriste);
	nastavPoziciObjektu (hra.micek, "micek");
	nastavPoziciObjektu (hra.palka1, "palka1");
	nastavPoziciObjektu (hra.palka2, "palka2");
}

zacniHru();

const tlacitko = document.getElementById("start");

tlacitko.addEventListener("click", hra.zmenStav);

document.addEventListener("keydown", function(event) {
	hra.klavesy[event.key] = true;
});


document.addEventListener("keyup", function(event) {
	hra.klavesy[event.key] = false;
});

//asi by to šlo jeste lepe pospojovat objektove nebo pomocí ES6 trid (napr. bych vyuzil dedicnost -
//nastavPozici by mohla byt metoda predka a ostatni by z ní dedili, a treba hriste by si ji predefinovalo
//ale vzhledem k rozsahu programu mi prijde tohle fajn, protože je to prehledne