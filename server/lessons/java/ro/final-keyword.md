Uneori ai o valoare care nu ar trebui **niciodată să se schimbe**. Respectul maxim al unui membru, numele orașului, numărul maxim de stele de urmărire — acestea sunt constante. În Java, cuvântul cheie `final` blochează o variabilă astfel încât să nu poată fi reatribuită

---

## Variabile final

```java
public class Main {
    public static void main(String[] args) {
        final int RESPECT_MAXIM = 100;
        final String ORAS = "Vice City";

        System.out.println(ORAS + " - Respect maxim: " + RESPECT_MAXIM);
    }
}
```

Ieșire

```text
Vice City - Respect maxim: 100
```

Odată ce o variabilă `final` este setată, gata. Încearcă să o schimbi și Java va refuza să compileze:

```java
public class Main {
    public static void main(String[] args) {
        final int RESPECT_MAXIM = 100;
        RESPECT_MAXIM = 200;  // EROARE: nu se poate atribui o valoare unei variabile final
    }
}
```

---

## Convenția de denumire: MAJUSCULE

Prin convenție, constantele `final` folosesc **SCREAMING_SNAKE_CASE** — toate literele mari, cu underscore între cuvinte:

```java
public class Main {
    public static void main(String[] args) {
        final int VITEZA_MAXIMA = 250;
        final String NUME_JUCATOR = "Tommy Vercetti";
        final double COMISION = 0.15;
        final int VIETI_LA_START = 3;
    }
}
```

Asta face constantele instant recognoscibile în codul tău. Când vezi `VITEZA_MAXIMA`, știi că e o constantă fără măcar să te uiți la declarație

---

## Câmpuri final în clase

Poți folosi `final` și pe câmpurile claselor. Un model comun este `static final` pentru constante la nivel de clasă:

```java
class Oras {
    static final String NUME = "Vice City";
    static final int CARTIERE = 6;
    static final int ANUL = 1986;
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Oras: " + Oras.NUME);
        System.out.println("Cartiere: " + Oras.CARTIERE);
        System.out.println("Anul: " + Oras.ANUL);
    }
}
```

Ieșire

```text
Oras: Vice City
Cartiere: 6
Anul: 1986
```

`static final` înseamnă "o singură copie pentru toată clasa, și nu se schimbă niciodată". Acesta este echivalentul Java al unei constante adevărate. O să vezi modelul ăsta peste tot în cod Java real

---

## Câmpuri de instanță final

Poți face și câmpurile de instanță `final` — ele se setează o singură dată (în constructor) și nu se schimbă niciodată:

```java
class Jucator {
    final String nume;
    int respect;

    Jucator(String nume) {
        this.nume = nume;  // setat o singura data
        this.respect = 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Lance Vance");
        p.respect = 50;     // ok - respect nu e final
        // p.nume = "Tommy";  // EROARE - nume e final
        System.out.println(p.nume + ": " + p.respect);
    }
}
```

Ieșire

```text
Lance Vance: 50
```

Asta e grozav pentru câmpuri care ar trebui setate la creare și nemodificate niciodată — cum ar fi numele unui membru al bandei

---

## Ce NU face final

`final` oprește **reatribuirea** variabilei, dar nu face obiectele imutabile. Dacă ai un array `final`, tot poți schimba elementele din interiorul lui:

```java
public class Main {
    public static void main(String[] args) {
        final int[] incasari = {10, 20, 30};
        incasari[0] = 99;   // permis! Am schimbat continutul, nu variabila
        // incasari = new int[]{1, 2, 3};  // EROARE! Nu putem reatribui variabila
        System.out.println(incasari[0]);
    }
}
```

Ieșire

```text
99
```

`final` înseamnă că variabila indică mereu către **același obiect**. Ce se întâmplă în interiorul acelui obiect e o cu totul altă poveste

---

## Misiune: Constantele lui Tommy

Unele valori din imperiul lui Tommy nu trebuie să se schimbe niciodată: respectul maxim pe care îl poate avea un membru și numele orașului. Definește-le ca pe niște constante blocate pe care niciun cod nu le poate suprascrie din greșeală.

Creează două constante `final`:

1. `RESPECT_MAXIM` setată la `100`
2. `ORAS` setată la `"Vice City"`

Afișează ambele constante pe linii separate.

**Exemplu**

```text
100
Vice City
```
