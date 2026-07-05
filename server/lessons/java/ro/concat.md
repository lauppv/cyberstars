Avem deja **+**, **-**, **\***, **/** și **%**. Dar **+** are un al doilea talent: pe lângă adunarea numerelor, poate **lipi text**. Acesta este modul clasic în Java de a combina text și variabile

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Quincy";
        int varsta = 32;
        double inaltime = 1.97;

        System.out.println("Salut. Ma numesc " + nume + ", am " + varsta + " ani si inaltimea de " + inaltime + " m");
    }
}
```

Ieșire

```text
Salut. Ma numesc Quincy, am 32 ani si inaltimea de 1.97 m
```

Ce se întâmplă aici? Când punem un **String** și o altă valoare împreună cu **+**, Java **convertește totul în text** și le lipește. Asta se numește **concatenare de string-uri** (string concatenation)

Fii atent la spații

```text
"Salut. Ma numesc " + nume
```

Avem un spațiu **înainte de ghilimeaua de închidere**, altfel am obține **Salut. Ma numescQuincy**, totul lipit. Asta e ceva ce aproape toată lumea greșește la început. **Verifică-ți mereu spațiile**

---

O subtilitate mică, dar foarte importantă

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Rezultat: " + 2 + 3);
    }
}
```

Ce crezi că afișează asta? **Rezultat: 5**?

Afișează **Rezultat: 23**

De ce? Java citește de la **stânga la dreapta**. Începe cu **"Rezultat: "** (un String), apoi vede **+ 2**: un String + un int = String, deci devine **"Rezultat: 2"**. Apoi **+ 3** → **"Rezultat: 23"**

Dacă vrem **5**, folosim **paranteze** ca să forțăm calculul matematic mai întâi

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Rezultat: " + (2 + 3));
    }
}
```

Ieșire

```text
Rezultat: 5
```

Acum **(2 + 3)** este calculat mai întâi (dând **5**), apoi lipit de string. Ține minte regula asta, o să dai de ea în cod real

---

**+** este suficient pentru cazuri simple, dar când ai mult text de combinat devine greu de citit, plin de ghilimele și de **+**-uri. Java are o alternativă mai curată: **String.format()**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        String mesaj = String.format("Salut, %s!", nume);
        System.out.println(mesaj);
    }
}
```

Ieșire

```text
Salut, Tommy Vercetti!
```

**%s** este un **placeholder** (un loc rezervat) — înseamnă „pune un String aici". Când Java rulează `String.format(...)`, înlocuiește `%s` cu valoarea lui `nume`. Gândește-te la el ca la un șablon în care umpli spațiile goale

---

Există placeholder-e diferite pentru tipuri diferite

- **%s** — String (sau orice altceva — Java îl convertește în text)
- **%d** — număr întreg (int)
- **%f** — număr cu virgulă (double)

```java
public class Main {
    public static void main(String[] args) {
        String jucator = "Lance Vance";
        int eliminari = 47;
        double acuratete = 82.5;

        System.out.println(String.format("Jucator: %s | Eliminari: %d | Acuratete: %f", jucator, eliminari, acuratete));
    }
}
```

Ieșire

```text
Jucator: Lance Vance | Eliminari: 47 | Acuratete: 82.500000
```

Stai, o grămadă de zecimale! În mod implicit, **%f** afișează 6 zecimale. Ca să controlezi asta, folosește **%.Nf**, unde N este numărul de zecimale dorit

---

**%.2f** înseamnă „afișează 2 zecimale". Acesta e cel pe care îl vei folosi cel mai des

```java
public class Main {
    public static void main(String[] args) {
        double pret = 4.5;
        System.out.println(String.format("Pret: $%.2f", pret));
    }
}
```

Ieșire

```text
Pret: $4.50
```

---

Java are și **printf()**, care formatează ȘI afișează într-un singur pas, așa că nu mai ai nevoie de `String.format()` plus `System.out.println()` separat

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy";
        int scor = 1500;
        System.out.printf("Jucator: %s | Scor: %d%n", nume, scor);
    }
}
```

Observă **%n** la final — acela e caracterul de linie nouă pentru printf. Fără el, următoarea afișare ar continua pe aceeași linie

Folosește ce preferi — `String.format()` e bună când vrei să stochezi textul într-o variabilă, iar `printf()` e bună când vrei doar să-l afișezi imediat

---

## Misiune: Tabloul de Scor

Sala de jocuri a stației tocmai a terminat un turneu. Afișează statisticile câștigătorului pe o singură linie.

Creează trei variabile: numele jucătorului (String), scorul total (int) și ratingul de performanță (double). Apoi afișează o linie de forma `Jucator: <nume> | Scor: <scor> | Rating: <rating>`. Poți folosi **+** sau **String.format()** — cum preferi.

**Exemplu**

Cu numele `Tommy Vercetti`, scorul `1500` și ratingul `4.75`, programul tău ar trebui să afișeze

```text
Jucator: Tommy Vercetti | Scor: 1500 | Rating: 4.75
```
