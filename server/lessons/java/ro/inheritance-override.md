Lecția trecută am văzut că o clasă copil poate înlocui metoda unui părinte cu propria ei versiune. Asta se numește **suprascriere (overriding)**. Java are o adnotare specială pentru asta: **@Override**

```text
class Criminal {
    void vorbeste() {
        System.out.println("...");
    }
}

class Sofer extends Criminal {
    @Override
    void vorbeste() {
        System.out.println("Urca in masina!");
    }
}
```

Adnotarea `@Override` nu este tehnic obligatorie — codul tău compilează și fără ea. Dar ar trebui **mereu** să o folosești. Iată de ce: dacă scrii din greșeală numele metodei greșit, Java va crede că creezi o metodă NOUĂ în loc să o suprascrii pe cea veche. Cu `@Override`, Java verifică dacă părintele are într-adevăr acea metodă și se răstește la tine dacă nu o are

```text
class Sofer extends Criminal {
    @Override
    void vorbeshte() {  // GRESEALA DE SCRIERE! Eroare de compilare - Criminal nu are vorbeshte()
        System.out.println("Urca in masina!");
    }
}
```

Fără `@Override`, asta ar crea în tăcere o metodă `vorbeshte()` inutilă, iar bug-ul te-ar bântui ore întregi. Crede-mă, Tommy Vercetti nu are timp pentru asta

---

Uneori nu vrei să ÎNLOCUIEȘTI comportamentul părintelui — vrei să ADAUGI la el. Aici intervine **super.method()**

```java
class Vehicul {
    void porneste() {
        System.out.println("Vehiculul porneste...");
    }
}

class Masina extends Vehicul {
    @Override
    void porneste() {
        super.porneste();  // apeleaza mai intai versiunea parintelui
        System.out.println("Motorul masinii tureaza!");
    }
}

public class Main {
    public static void main(String[] args) {
        Masina m = new Masina();
        m.porneste();
    }
}
```

Rezultat

```text
Vehiculul porneste...
Motorul masinii tureaza!
```

`super.porneste()` spune "rulează mai întâi versiunea părintelui pentru porneste(), APOI fă lucrurile mele suplimentare." Este ca Lance Vance care face tot ce face un criminal obișnuit, plus propriile lui misiuni secundare

---

**Suprascriere vs Supraîncărcare (Overriding vs Overloading)** — sună asemănător dar sunt lucruri complet diferite

**Suprascriere (Overriding)**: clasa copil înlocuiește o metodă a părintelui (același nume, aceiași parametri)

```text
class Criminal {
    void vorbeste() { ... }
}
class Sofer extends Criminal {
    @Override
    void vorbeste() { ... }  // SUPRASCRIERE - inlocuieste vorbeste() al parintelui
}
```

**Supraîncărcare (Overloading)**: aceeași clasă are mai multe metode cu același nume dar parametri DIFERIȚI

```text
class Garaj {
    void repara(String masina) {
        System.out.println("Repar " + masina);
    }
    void repara(String masina, int ore) {  // SUPRAINCARCARE - numar diferit de parametri
        System.out.println("Repar " + masina + " in " + ore + " ore");
    }
}
```

Suprascriere = între părinte și copil, aceeași semnătură. Supraîncărcare = aceeași clasă, semnături diferite. Nu le confunda la un test :)

---

Iată un exemplu complet cu afacerile lui Tommy

```java
class Afacere {
    int incasari() {
        return 0;
    }
}

class Club extends Afacere {
    int clienti;

    Club(int clienti) {
        this.clienti = clienti;
    }

    @Override
    int incasari() {
        return clienti * 50;
    }
}

class Spalatorie extends Afacere {
    int masini;
    int pret;

    Spalatorie(int masini, int pret) {
        this.masini = masini;
        this.pret = pret;
    }

    @Override
    int incasari() {
        return masini * pret;
    }
}

public class Main {
    public static void main(String[] args) {
        Club c = new Club(120);
        Spalatorie s = new Spalatorie(30, 8);
        System.out.println("Incasari club: " + c.incasari());
        System.out.println("Incasari spalatorie: " + s.incasari());
    }
}
```

Rezultat

```text
Incasari club: 6000
Incasari spalatorie: 240
```

---

## Misiune: Încasările Afacerilor lui Tommy

Tommy deține mai multe afaceri în Vice City, fiecare cu felul ei de a face bani. Are nevoie de un program care calculează încasările fiecăreia.

Creează o clasă `Afacere` cu o metodă `incasari()` care returnează `0`. Apoi creează două clase copil:

1. `Club` — are un câmp `int clienti`, suprascrie `incasari()` ca să returneze `clienti * 50`
2. `Spalatorie` — are câmpurile `int masini` și `int pret`, suprascrie `incasari()` ca să returneze `masini * pret`

Folosește `@Override` pe amândouă. În `main`, creează un `Club` cu `120` clienți și o `Spalatorie` cu `30` mașini și prețul `8`. Afișează fiecare încasare cu etichetele de mai jos.

**Exemplu**

```text
Incasari club: 6000
Incasari spalatorie: 240
```
