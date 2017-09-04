const SIRKA = 45;
// sirka palky - tj. kam az testovat sirku palky pri odrazu micku 
// (odviji se od max. rychlosti micku)

const POCX = 3; // pocatecni rychlost micku smer X
const POCY = 0; // pocatecni rychlost micku smer Y
// konstanty bohuzel nelze nastavit uvnitr trid

class ObjektNaHristi {
	constructor(id) {
		this.ja = document.getElementById(id),
		this.posX = this.ja.offsetLeft;
		this.posY = this.ja.offsetTop;
		this.sirka = this.ja.offsetWidth;
		this.vyska = this.ja.offsetHeight;
		this.startPosX = this.posX;
		this.startPosY = this.posY;
	} // nastaveni uvodnich rozmeru pro micek a palky

	vykresli() {
		this.ja.style.left = this.posX+"px"; 
		this.ja.style.top = this.posY+"px";
	}

	vratNaZacatek() {
			this.posX = this.startPosX;
			this.posY = this.startPosY;
			if ("smerX" in this) {
				this.smerX = Math.random() > 0.5 ? -POCX : POCX; 
				this.smerY = Math.random() > 0.5 ? -POCY : POCY;
			}
			this.vykresli();
	}
}

class Micek extends ObjektNaHristi {
	constructor(id) {
		super (id);
		this.rychlost = Math.sqrt(POCX**2 + POCY**2);
		this.smerX = Math.random() > 0.5 ? -POCX : POCX;
		this.smerY = Math.random() > 0.5 ? -POCY : POCY;
		console.log("konstruktor - mic");
	}

	odraz(palka) {      
		const stredM = this.posY + this.vyska/2;
		const vrsekP = palka.posY + palka.vyska + this.vyska/2;
		const stredP = palka.posY + palka.vyska/2; 
		let uhel = (stredP - stredM) / (vrsekP - stredP); //vypocet uhlu odrazu
		uhel *= 75; // max uhel odrazu = 75 stupnu
		uhel = uhel * Math.PI / 180; // prevod na radiany
		this.smerX = Math.cos(uhel) * this.rychlost;
		this.smerY = Math.sin(uhel) * this.rychlost;
		this.smerY = - this.smerY; // spravne nastaveni smeru - kvuli logice v goniometrii je to az na konci
	} // vypocet, jak se ma micek odrazit od palky

	pohniMickem() {
		if (((this.posX < palka1.posX + palka1.sirka &&
			this.posX >= palka1.posX + palka1.sirka - SIRKA &&
			this.smerX < 0 ) || (
			this.posX + this.sirka > palka1.posX &&
			this.posX + this.sirka <= palka1.posX + SIRKA &&
			this.smerX > 0 )) &&		
			this.posY + this.vyska > palka1.posY &&
			this.posY < palka1.posY + palka1.vyska) { 
			this.odraz(palka1);  // odraz od palky 1
		} else if (this.posX < 0) {
			hra.skore2.nastavSkore (++hra.skore2.hodnota);
			this.vratNaZacatek(); // leva zed (novy mic + zvyseni skore)
		}	
		if (((this.posX + this.sirka > palka2.posX &&
				this.posX + this.sirka <= palka2.posX + SIRKA &&
				this.smerX > 0 ) || (
				this.posX < palka2.posX + palka2.sirka &&
			this.posX >= palka2.posX + palka2.sirka - SIRKA &&
			this.smerX < 0 )) &&		
			this.posY + this.vyska > palka2.posY &&
			this.posY < palka2.posY + palka2.vyska) {  
			this.odraz(palka2); // odraz od palky 2
			this.smerX = -this.smerX; // smer bude opacny nez vysel z goniometriceho vypoctu
		} else if (this.posX + this.sirka > hriste.sirka) { 
			hra.skore1.nastavSkore (++hra.skore1.hodnota);
			this.vratNaZacatek(); // prava zed (novy mic + zvyseni skore)
		}
		if (this.posY < 0) { // horni zed
			this.smerY = -this.smerY;
		}
		if (this.posY + this.vyska > hriste.vyska) { // dolni zed
			this.smerY = -this.smerY;
		}
		this.posX += this.smerX;
		this.posY += this.smerY;
		this.vykresli();
	}
}

class Palka extends ObjektNaHristi {
	constructor(id, klavesaNahoru, klavesaDolu) {
		super (id);
		this.klavesaNahoru = klavesaNahoru;
		this.klavesaDolu = klavesaDolu;		
		this.klavesaNahoru1 = (this.klavesaNahoru.length === 1) ? this.klavesaNahoru.toUpperCase() : null;
		this.klavesaDolu1 = (this.klavesaDolu.length === 1) ? this.klavesaDolu.toUpperCase() : null;
		console.log(this.klavesaNahoru, this.klavesaDolu, this.klavesaNahoru1, this.klavesaDolu1);
	}

	vykresli() {
		this.ja.style.top = this.posY+"px";
	}

	pohniPalkou() {
		const klavesy = hra.klavesy;
		if (klavesy[this.klavesaNahoru] || klavesy[this.klavesaNahoru1]) { // palka jde nahoru
			this.posY -= 2;
			if (this.posY < 0) { 
				this.posY = 0; 
			}
			this.vykresli();
		}
		if (klavesy[this.klavesaDolu] || klavesy[this.klavesaDolu1]) {    // palka jde dolu
			this.posY += 2;
			if (this.posY > hriste.vyska - this.vyska) { 
				this.posY = hriste.vyska - this.vyska; 
			}
			this.vykresli();
		}
	}	
}

class AI { // umela inteligence
	constructor(id, palka) {
		this.id = id;
		this.palka = palka;
		this.zapnuta = false;
		this.zapniAI = this.zapniAI.bind(this);
	}

	zapniAI() {  // nebo vypni, je to spis "toggle" funkce
		this.zapnuta = !this.zapnuta;
		aiTlacitka[this.id-1].tlacitko.innerHTML = this.zapnuta ? 
					("Vrať hráče "+this.id+"<br>do hry") : ("Zapni počítač místo hráče "+this.id);
		let hrac = document.getElementById("hrac" + this.id);
		let skore = document.getElementById("skore" + this.id);
		if (this.zapnuta) {
			hrac.innerHTML = "Počítač"
			hrac.style.color = "grey";
			skore.style.color = "grey";
		} else {
			hrac.innerHTML = "Hráč " + this.id;
			hrac.style.color = "black";
			skore.style.color = "black";
			console.log (hra.klavesy);	
			hra.klavesy[this.palka.klavesaNahoru] = false;
			hra.klavesy[this.palka.klavesaDolu] = false;
			console.log (hra.klavesy);	
		}
	}

	pouzijAI() {
		if (this.zapnuta) {
			this.spocitejAI();
		}
	}

	spocitejAI() { // umela inteligence pro palky
		const pulPalky = this.palka.vyska / 2;
		const pulHriste = hriste.sirka / 2;
		const mojePulka = (this.id === 1) ? micek.posX + micek.sirka < pulHriste : micek.posX > pulHriste;
		if (micek.posY + micek.vyska < this.palka.posY + pulPalky && mojePulka) {
			hra.klavesy[this.palka.klavesaNahoru] = true;
		} else {
			hra.klavesy[this.palka.klavesaNahoru] = false;
		}
		if (micek.posY > this.palka.posY + pulPalky && mojePulka) {
			hra.klavesy[this.palka.klavesaDolu] = true;
		} else {
			hra.klavesy[this.palka.klavesaDolu] = false;
		}
	}
}

class Hriste {
	constructor(id) {
		this.ja = document.getElementById(id);
		this.sirka = this.ja.clientWidth;
		this.vyska = this.ja.clientHeight;
		console.log("konstruktor - hriste");
	} // nastaveni uvodnich rozmeru pro hriste
}

class Skore {
	constructor(id) {
		this.id = id;
		this.hodnota = 0;
		this.ja = document.getElementById("skore" + this.id);
	}

	nastavSkore(kolik) {
		this.hodnota = kolik;
		this.ja.innerHTML = kolik;
	}
}

class Hra {
	constructor () {
		this.skore1 = new Skore(1);
		this.skore2 = new Skore(2);
		this.klavesy = {};
		this.interval = 0;
		this.odstartovana = false;
		this.zmenStav = this.zmenStav.bind(this);
		this.restart = this.restart.bind(this);
	} 

	hraj() {
		micek.pohniMickem();
		ai1.pouzijAI();
		ai2.pouzijAI();
		palka1.pohniPalkou();
		palka2.pohniPalkou();
	} // cyklus spusteny setIntervalem ve funkci zmenStav

	zmenStav() {
		this.odstartovana = !this.odstartovana;
		startTlacitko.tlacitko.innerHTML = this.odstartovana ? "Stop" : "Stopnuto";
		if (this.odstartovana) {
			this.interval = setInterval (this.hraj, 1);
		} else {
			clearInterval(this.interval);
		}
	}; // odstartuje hru - nebo ji zastavi, pokud je uz odstartovana - opet "toggle" funkce

	restart() { // vse odznovu
		if (this.odstartovana) {
			clearInterval (this.interval);
			this.odstartovana = false;
		}
		startTlacitko.tlacitko.innerHTML = "Start";
		this.skore1.nastavSkore(0);
		this.skore2.nastavSkore(0);
		micek.vratNaZacatek();
		palka1.vratNaZacatek();
		palka2.vratNaZacatek();
	}
}

class Tlacitko {
	constructor (id, funkce) {
		this.tlacitko = document.getElementById(id);
		this.tlacitko.addEventListener("click", funkce);
	}
}


const hra = new Hra();
const hriste = new Hriste("hriste");
const micek = new Micek("micek");
const palka1 = new Palka("palka1", "w", "s");
const palka2 = new Palka("palka2", "ArrowUp", "ArrowDown");
const ai1 = new AI(1, palka1);
const ai2 = new AI(2, palka2);

const startTlacitko = new Tlacitko ("start", hra.zmenStav); // start nebo stop
const resetTlacitko = new Tlacitko ("reset", hra.restarts); // restart cele hry
const aiTlacitka = [new Tlacitko ("ai1", ai1.zapniAI),
					new Tlacitko ("ai2", ai2.zapniAI)];  // umela inteligence pro palky 1 a 2

document.addEventListener("keydown", function(event) {
	hra.klavesy[event.key] = true;
});
document.addEventListener("keyup", function(event) {
	hra.klavesy[event.key] = false;
});