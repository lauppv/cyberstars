Scrii `public static void main` încă din prima zi, dar nu te-ai întrebat niciodată cu adevărat ce înseamnă `static`. E momentul să afli

Cuvântul-cheie `static` înseamnă **„asta aparține clasei însăși, nu vreunui obiect individual"**

---

## Câmpuri Static vs Câmpuri de Instanță

Imaginează-ți un club de noapte din Vice City care ține evidența vizitatorilor. Fiecare vizitator are propriul nume, dar **numărul total de vizite** este partajat între toți — aparține clubului, nu vreunei persoane:

```java
class Vizitator {
    String nume;
    static int totalVizite = 0;

    Vizitator(String nume) {
        this.nume = nume;
        totalVizite++;
    }
}

public class Main {
    public static void main(String[] args) {
        Vizitator v1 = new Vizitator("Tommy");
        Vizitator v2 = new Vizitator("Lance");
        Vizitator v3 = new Vizitator("Cortez");
        System.out.println("Total vizite: " + Vizitator.totalVizite);
    }
}
```

Afișează

```text
Total vizite: 3
```

Observă câteva lucruri:

- `totalVizite` este `static` — există o **singură copie** partajată de toate obiectele Vizitator
- De fiecare dată când creăm un nou Vizitator, constructorul mărește `totalVizite` cu 1
- Îl accesăm cu `Vizitator.totalVizite` (numele clasei), nu cu `v1.totalVizite`

Între timp, `nume` este un câmp de instanță — fiecare vizitator are propriul lui nume

---

## Metode Statice

Metodele statice aparțin și ele clasei. Le-ai folosit tot timpul:

```java
public class Main {
    public static void main(String[] args) {
        int maiMare = Math.max(10, 20);   // Math este clasa, max este o metoda statica
    }
}
```

Nu creezi un obiect `Math` ca să folosești `max()`. Este un utilitar care nu are nevoie de starea vreunui obiect

Iată cum să scrii propria ta versiune:

```java
class AjutorMate {
    static int patrat(int n) {
        return n * n;
    }

    static int aduna(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(AjutorMate.patrat(5));
        System.out.println(AjutorMate.aduna(3, 7));
    }
}
```

Afișează

```text
25
10
```

Niciun obiect necesar. Apelează-le direct pe clasă

---

## De Ce Este main() Static?

Când pornește programul tău, încă nu există niciun obiect. Java are nevoie de o cale de a începe execuția fără să creeze mai întâi un obiect. De asta este `main` `static` — este o metodă la nivel de clasă care rulează fără să aibă nevoie de o instanță

```java
public class Main {
    public static void main(String[] args) {
        // Asta ruleaza prima. Niciun obiect nu exista inca.
        // De aici, CREEZI obiecte si le apelezi metodele.
    }
}
```

---

## Static Nu Poate Accesa Instanța

O metodă statică nu are `this` — nu există niciun obiect asociat cu ea. Așa că **nu poate** accesa câmpuri de instanță sau metode de instanță:

```java
class Exemplu {
    int x = 10;           // camp de instanta
    static int y = 20;    // camp static

    static void afiseaza() {
        System.out.println(y);   // OK - y este static
        // System.out.println(x); // EROARE - x are nevoie de un obiect
    }

    void arata() {
        System.out.println(x);   // OK - metoda de instanta are un obiect
        System.out.println(y);   // OK - campurile statice sunt mereu accesibile
    }
}
```

Regula: **instanța poate accesa static-ul, dar static-ul nu poate accesa instanța**. Gândește-te așa: clasa există chiar și când nu există niciun obiect, deci codul static nu poate presupune că vreun obiect este prin preajmă

---

## Numărarea Instanțelor — Un Tipar Clasic

Folosirea unui câmp static pentru a urmări câte obiecte au fost create este unul dintre cele mai comune tipare statice:

```java
class Inamic {
    String tip;
    static int numarInamici = 0;

    Inamic(String tip) {
        this.tip = tip;
        numarInamici++;
    }
}

public class Main {
    public static void main(String[] args) {
        Inamic e1 = new Inamic("Goon");
        Inamic e2 = new Inamic("Boss");
        Inamic e3 = new Inamic("Sniper");
        Inamic e4 = new Inamic("Goon");
        System.out.println("Inamici aparuti: " + Inamic.numarInamici);
    }
}
```

Afișează

```text
Inamici aparuti: 4
```

---

## Misiune: Lista de la Intrarea Clubului

Clubul Malibu al lui Tommy ține evidența cui intră. Fiecare vizitator are numele lui, dar numărul total de intrări este partajat — aparține clubului, nu vreunei persoane.

Creează o clasă `Vizitator` cu:

1. Un câmp de instanță `String nume`
2. Un câmp `static int totalVizite` care începe de la 0
3. Un constructor care primește un nume și incrementează `totalVizite`

În `main`, înregistrează 3 vizitatori: `"Tommy"`, `"Lance"` și `"Cortez"`. Apoi afișează numărul total de vizite.

**Exemplu** — trei vizitatori înregistrați la intrare

```text
3
```
