Uneori ai o valoare care nu ar trebui **niciodată să se schimbe**. Viața maximă a unui jucător, numele jocului, viteza luminii — acestea sunt constante. În Java, cuvântul cheie `final` blochează o variabilă astfel încât să nu poată fi reatribuită

---

## Variabile final

```java
public class Main {
    public static void main(String[] args) {
        final int VIATA_MAXIMA = 100;
        final String NUME_JOC = "CyberQuest";

        System.out.println(NUME_JOC + " - Viata maxima: " + VIATA_MAXIMA);
    }
}
```

Output

```text
CyberQuest - Viata maxima: 100
```

Odată ce o variabilă `final` este setată, gata. Încearcă să o schimbi și Java va refuza să compileze:

```java
public class Main {
    public static void main(String[] args) {
        final int VIATA_MAXIMA = 100;
        VIATA_MAXIMA = 200;  // EROARE: nu se poate atribui o valoare unei variabile final
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
        final double GRAVITATIE = 9.81;
        final int VIETI_LA_START = 3;
    }
}
```

Asta face constantele instant recognoscibile în codul tău. Când vezi `VITEZA_MAXIMA`, știi că e o constantă fără măcar să te uiți la declarație

---

## Câmpuri final în clase

Poți folosi `final` și pe câmpurile claselor. Un model comun este `static final` pentru constante la nivel de clasă:

```java
class Joc {
    static final int JUCATORI_MAXIM = 4;
    static final String VERSIUNE = "1.0";
    static final int SCOR_CASTIG = 1000;
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Versiune joc: " + Joc.VERSIUNE);
        System.out.println("Jucatori maxim: " + Joc.JUCATORI_MAXIM);
        System.out.println("Castigi la: " + Joc.SCOR_CASTIG + " puncte");
    }
}
```

Output

```text
Versiune joc: 1.0
Jucatori maxim: 4
Castigi la: 1000 puncte
```

`static final` înseamnă "o singură copie pentru toată clasa, și nu se schimbă niciodată". Acesta este echivalentul Java al unei constante adevărate. O să vezi modelul ăsta peste tot în cod Java real

---

## Câmpuri de instanță final

Poți face și câmpurile de instanță `final` — ele se setează o singură dată (în constructor) și nu se schimbă niciodată:

```java
class Jucator {
    final String nume;
    int scor;

    Jucator(String nume) {
        this.nume = nume;  // setat o singură dată
        this.scor = 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Lance Vance");
        p.scor = 50;     // ok — scor nu e final
        // p.nume = "Tommy";  // EROARE — nume e final
        System.out.println(p.nume + ": " + p.scor);
    }
}
```

Output

```text
Lance Vance: 50
```

Asta e grozav pentru câmpuri care ar trebui setate la creare și nemodificate niciodată — cum ar fi ID-ul sau numele de utilizator al unui jucător

---

## Comparație cu Python

Python nu are un cuvânt cheie `final` real. Prin convenție, constantele se scriu cu MAJUSCULE, dar nimic nu te oprește efectiv să le schimbi:

```python
MAX_HEALTH = 100
MAX_HEALTH = 200  # Python nu te va opri
```

Java chiar îl impune. Dacă spui `final`, vorbești serios, iar compilatorul te ține de cuvânt

---

## Ce NU face final

`final` oprește **reatribuirea** variabilei, dar nu face obiectele imutabile. Dacă ai un array `final`, tot poți schimba elementele din interiorul lui:

```java
public class Main {
    public static void main(String[] args) {
        final int[] scoruri = {10, 20, 30};
        scoruri[0] = 99;   // permis! Am schimbat conținutul, nu variabila
        // scoruri = new int[]{1, 2, 3};  // EROARE! Nu putem reatribui variabila
        System.out.println(scoruri[0]);
    }
}
```

Output

```text
99
```

`final` înseamnă că variabila indică mereu către **același obiect**. Ce se întâmplă în interiorul acelui obiect e o cu totul altă poveste

---

## Misiune: Blocarea Configurației Stației

Parametrii de bază ai stației — capacitatea maximă a scutului și denumirea oficială a stației — nu trebuie să se schimbe niciodată odată inițializați. Sarcina ta este să definești acestea ca pe niște constante blocate pe care niciun cod nu le poate suprascrie din greșeală.

Creează două constante `final`:

1. `VIATA_MAXIMA` setată la `100`
2. `NUME_JOC` setată la `"CyberQuest"`

Afișează ambele constante pe linii separate.

**Exemplu**

Programul tău ar trebui să afișeze

```text
100
CyberQuest
```
