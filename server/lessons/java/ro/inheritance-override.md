Lecția trecută am văzut că o clasă copil poate înlocui metoda unui părinte cu propria ei versiune. Asta se numește **suprascriere (overriding)**. Java are o adnotare specială pentru asta: **@Override**

```java
class Animal {
    void vorbeste() {
        System.out.println("...");
    }
}

class Caine extends Animal {
    @Override
    void vorbeste() {
        System.out.println("Ham!");
    }
}
```

Adnotarea `@Override` nu este tehnic obligatorie — codul tău compilează și fără ea. Dar ar trebui **mereu** să o folosești. Iată de ce: dacă scrii din greșeală numele metodei greșit, Java va crede că creezi o metodă NOUĂ în loc să o suprascrii pe cea veche. Cu `@Override`, Java verifică dacă părintele are într-adevăr acea metodă și se răstește la tine dacă nu o are

```java
class Caine extends Animal {
    @Override
    void vorbeshte() {  // GREȘEALĂ DE SCRIERE! Eroare de compilare pentru că Animal nu are vorbeshte()
        System.out.println("Ham!");
    }
}
```

Fără `@Override`, asta ar crea în tăcere o metodă `vorbeshte()` inutilă, iar bug-ul te-ar bântui ore întregi. Crede-mă, Tommy Vercetti nu are timp pentru asta

---

Uneori nu vrei să ÎNLOCUIEȘTI comportamentul părintelui — vrei să ADAUGI la el. Aici intervine **super.method()**

```java
class Vehicul {
    void porneste() {
        System.out.println("Vehiculul pornește...");
    }
}

class Masina extends Vehicul {
    @Override
    void porneste() {
        super.porneste();  // apelează mai întâi versiunea părintelui
        System.out.println("Motorul mașinii turează!");
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
Vehiculul pornește...
Motorul mașinii turează!
```

`super.porneste()` spune "rulează mai întâi versiunea părintelui pentru porneste(), APOI fă lucrurile mele suplimentare." Este ca Lance Vance care face tot ce face un criminal obișnuit, plus propriile lui misiuni secundare

---

**Suprascriere vs Supraîncărcare (Overriding vs Overloading)** — sună asemănător dar sunt lucruri complet diferite

**Suprascriere (Overriding)**: clasa copil înlocuiește o metodă a părintelui (același nume, aceiași parametri)

```java
class Animal {
    void vorbeste() { ... }
}
class Caine extends Animal {
    @Override
    void vorbeste() { ... }  // SUPRASCRIERE — înlocuiește vorbeste() al părintelui
}
```

**Supraîncărcare (Overloading)**: aceeași clasă are mai multe metode cu același nume dar parametri DIFERIȚI

```java
class Calculator {
    int aduna(int a, int b) {
        return a + b;
    }
    double aduna(double a, double b) {  // SUPRAÎNCĂRCARE — tipuri de parametri diferite
        return a + b;
    }
    int aduna(int a, int b, int c) {  // SUPRAÎNCĂRCARE — număr de parametri diferit
        return a + b + c;
    }
}
```

Suprascriere = între părinte și copil, aceeași semnătură. Supraîncărcare = aceeași clasă, semnături diferite. Nu le confunda la un test :)

---

Iată un exemplu complet cu forme

```java
class Forma {
    double arie() {
        return 0;
    }
}

class Cerc extends Forma {
    double raza;

    Cerc(double raza) {
        this.raza = raza;
    }

    @Override
    double arie() {
        return Math.PI * raza * raza;
    }
}

class Dreptunghi extends Forma {
    double latime, inaltime;

    Dreptunghi(double latime, double inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    @Override
    double arie() {
        return latime * inaltime;
    }
}

public class Main {
    public static void main(String[] args) {
        Cerc c = new Cerc(5);
        Dreptunghi d = new Dreptunghi(4, 6);
        System.out.println("Aria cercului: " + String.format("%.2f", c.arie()));
        System.out.println("Aria dreptunghiului: " + d.arie());
    }
}
```

Rezultat

```text
Aria cercului: 78.54
Aria dreptunghiului: 24.0
```

---

## Misiune: Calculator de Plăci de Carenă

Echipa de inginerie a stației înlocuiește plăci de carenă de diferite forme. Au nevoie de un program care calculează aria fiecărei plăci ca să poată comanda cantitatea corectă de material.

Creează o clasă `Forma` cu o metodă `arie()` care returnează `0`. Apoi creează două clase copil:

1. `Cerc` — are un câmp `double raza`, suprascrie `arie()` ca să returneze `Math.PI * raza * raza`
2. `Dreptunghi` — are câmpurile `double latime` și `double inaltime`, suprascrie `arie()` ca să returneze `latime * inaltime`

Folosește `@Override` pe amândouă. În `main`, creează un `Cerc` cu raza `5` și un `Dreptunghi` cu lățimea `4` și înălțimea `6`. Afișează fiecare arie cu etichetele de mai jos — folosește `String.format("%.2f", ...)` pentru cerc.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `5` — raza cercului
- `4`, `6` — lățimea și înălțimea dreptunghiului

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Aria cercului: 78.54
Aria dreptunghiului: 24.0
```
