Hai să construim ceva distractiv — un **simulator de luptă**! Gândește-te la el ca la un sistem de luptă pe ture dintr-un RPG. O să avem personaje cu viață și putere de atac, plus subclase pentru Razboinici și Magi cu propriile lor abilități speciale. Acest proiect folosește **moștenirea**, **metodele**, și **OOP** lucrând toate împreună

---

**Pasul 1: Clasa de bază Personaj**

Fiecare personaj are un **nume**, **viata**, și **putereAtac**. De asemenea, poate să **atace** alt personaj

```text
class Personaj {
    String nume;
    int viata;
    int putereAtac;

    Personaj(String nume, int viata, int putereAtac) {
        this.nume = nume;
        this.viata = viata;
        this.putereAtac = putereAtac;
    }

    void ataca(Personaj tinta) {
        tinta.viata -= this.putereAtac;
        System.out.println(this.nume + " ataca " + tinta.nume + " cu " + this.putereAtac + " daune!");
    }

    void afiseazaStatus() {
        System.out.println(this.nume + " - HP: " + this.viata);
    }
}
```

Metoda `ataca` reduce viața țintei cu puterea atacatorului. Simplu și eficient — ca o lovitură corp-la-corp de bază în Vice City

---

**Pasul 2: Subclasa Razboinic**

Un Razboinic are **armura** în plus, care reduce daunele primite. Suprascriem câmpurile părintelui și adăugăm logica de reducere a daunelor. Când un Razboinic e atacat, armura absoarbe o parte din daune

```text
class Razboinic extends Personaj {
    int armura;

    Razboinic(String nume, int viata, int putereAtac, int armura) {
        super(nume, viata, putereAtac);
        this.armura = armura;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac;
        tinta.viata -= daune;
        System.out.println(this.nume + " loveste cu sabia pe " + tinta.nume + " cu " + daune + " daune!");
    }
}
```

Metoda `ataca` a Razboinicului o suprascrie pe cea a părintelui ca să afișeze un mesaj mai specific. Apelul `super(...)` configurează câmpurile de bază ale clasei Personaj

---

**Pasul 3: Subclasa Mag**

Un Mag are **putereVraja** — magia lui face daune suplimentare peste atacul de bază

```text
class Mag extends Personaj {
    int putereVraja;

    Mag(String nume, int viata, int putereAtac, int putereVraja) {
        super(nume, viata, putereAtac);
        this.putereVraja = putereVraja;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac + this.putereVraja;
        tinta.viata -= daune;
        System.out.println(this.nume + " lanseaza o vraja asupra lui " + tinta.nume + " cu " + daune + " daune!");
    }
}
```

Metoda `ataca` a Mag-ului combină putereAtac-ul de bază și putereVraja pentru lovituri mai mari. Stil „tun de sticlă" — multe daune, dar de obicei mai puțină viață decât un Razboinic

---

**Punând totul cap la cap**

```java
class Personaj {
    String nume;
    int viata;
    int putereAtac;

    Personaj(String nume, int viata, int putereAtac) {
        this.nume = nume;
        this.viata = viata;
        this.putereAtac = putereAtac;
    }

    void ataca(Personaj tinta) {
        tinta.viata -= this.putereAtac;
        System.out.println(this.nume + " ataca " + tinta.nume + " cu " + this.putereAtac + " daune!");
    }

    void afiseazaStatus() {
        System.out.println(this.nume + " - HP: " + this.viata);
    }
}

class Razboinic extends Personaj {
    int armura;

    Razboinic(String nume, int viata, int putereAtac, int armura) {
        super(nume, viata, putereAtac);
        this.armura = armura;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac;
        tinta.viata -= daune;
        System.out.println(this.nume + " loveste cu sabia pe " + tinta.nume + " cu " + daune + " daune!");
    }
}

class Mag extends Personaj {
    int putereVraja;

    Mag(String nume, int viata, int putereAtac, int putereVraja) {
        super(nume, viata, putereAtac);
        this.putereVraja = putereVraja;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac + this.putereVraja;
        tinta.viata -= daune;
        System.out.println(this.nume + " lanseaza o vraja asupra lui " + tinta.nume + " cu " + daune + " daune!");
    }
}

public class Main {
    public static void main(String[] args) {
        Razboinic w = new Razboinic("Tommy", 100, 25, 10);
        Mag m = new Mag("Lance", 80, 15, 20);

        w.ataca(m);
        m.afiseazaStatus();

        m.ataca(w);
        w.afiseazaStatus();
    }
}
```

Ieșire

```text
Tommy loveste cu sabia pe Lance cu 25 daune!
Lance - HP: 55
Lance lanseaza o vraja asupra lui Tommy cu 35 daune!
Tommy - HP: 65
```

---

Acesta este **polimorfismul** în acțiune — atât Razboinic cât și Mag SUNT Personaje, dar fiecare atacă diferit. Metoda `ataca` face lucruri diferite în funcție de tipul real. În termeni de Vice City: Tommy lovește tare (Razboinic), în timp ce Lance folosește trucuri viclene (Mag)

Observă cum `afiseazaStatus()` este definită o singură dată în clasa părinte `Personaj`, dar atât Razboinic cât și Mag o pot folosi. Asta este puterea moștenirii — o scrii o dată, o refolosești peste tot

---

## Misiune: Protocolul de Luptă din Arenă

Doi membri ai echipajului au intrat în arena de antrenament holografică a stației. Tommy este un Razboinic de luptă apropiată, cu armură grea, iar Lance este un Mag care canalizează rafale de energie. Construiește sistemul de luptă și simulează o rundă de atacuri.

1. Creează o clasă `Personaj` cu `nume` (String), `viata` (int), `putereAtac` (int), un constructor, o metodă `ataca(Personaj tinta)` care reduce viața țintei cu `putereAtac` și afișează `"NUME ataca TINTA cu DAUNE daune!"`, și o metodă `afiseazaStatus()` care afișează `"NUME - HP: VIATA"`
2. Creează o clasă `Razboinic` care extinde Personaj cu `armura` (int). Suprascrie ataca ca să afișeze: `"NUME loveste cu sabia pe TINTA cu DAUNE daune!"` unde daune e egal cu putereAtac
3. Creează o clasă `Mag` care extinde Personaj cu `putereVraja` (int). Suprascrie ataca ca să afișeze: `"NUME lanseaza o vraja asupra lui TINTA cu DAUNE daune!"` unde daune e egal cu putereAtac + putereVraja
4. În main, stochează statisticile luptătorilor în variabile — `nume1`/`viata1`/`atac1`/`armura1` pentru Razboinic și `nume2`/`viata2`/`atac2`/`vraja2` pentru Mag (pornește cu Tommy/100/25/10 și Lance/80/15/20). Creează `Razboinic`-ul și `Mag`-ul din aceste variabile
5. Tommy îl atacă pe Lance, afișează statusul lui Lance. Apoi Lance îl atacă pe Tommy, afișează statusul lui Tommy

**Ieșire**

```text
Tommy loveste cu sabia pe Lance cu 25 daune!
Lance - HP: 55
Lance lanseaza o vraja asupra lui Tommy cu 35 daune!
Tommy - HP: 65
```
