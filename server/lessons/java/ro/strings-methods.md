Am văzut deja cum să declarăm un **String** și cum să combinăm string-uri cu **+**. E timpul să ne uităm la cele mai utile **metode pentru String** din Java

---

Cât de lung este un string? **.length()**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume.length());
    }
}
```

Output **14**. Spațiile contează și ele. Observă **parantezele** **()** de la final — în Java, **length** este o **metodă**, așa că o apelăm ca atare. (Pentru array-uri sintaxa este diferită, doar **arr.length** fără paranteze. Java e plin de mici inconsecvențe ca asta :)

---

Litere mari și litere mici

```java
public class Main {
    public static void main(String[] args) {
        String nume = "tommy vercetti";
        System.out.println(nume.toUpperCase());   // TOMMY VERCETTI
        System.out.println(nume.toLowerCase());   // tommy vercetti
    }
}
```

**Important**: aceste metode **NU** schimbă variabila originală. Ele dau înapoi un string **nou**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "tommy";
        nume.toUpperCase();
        System.out.println(nume);   // tot "tommy"
    }
}
```

Ca să păstrăm efectiv versiunea cu majuscule

```java
public class Main {
    public static void main(String[] args) {
        nume = nume.toUpperCase();
        System.out.println(nume);   // "TOMMY"
    }
}
```

Această capcană prinde pe toată lumea la început. String-urile în Java sunt **imutabile** — nu pot fi schimbate. Metodele întorc întotdeauna un string nou

---

Obține un **substring** (o bucată din string)

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume.substring(0, 5));   // Tommy
        System.out.println(nume.substring(6));      // Vercetti
    }
}
```

**substring(start, end)** dă caracterele de la poziția **start** până la (dar **fără** a include) poziția **end**. Exact ca **range()** în Python și ca slicing-ul — capătul este exclusiv

**substring(start)** cu un singur argument dă tot de la **start** până la finalul string-ului

Numărarea începe de la **0**, ca întotdeauna în programare. **nume.substring(0, 5)** înseamnă pozițiile **0, 1, 2, 3, 4** care formează **Tommy**

---

Un singur caracter de la o poziție

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        System.out.println(nume.charAt(0));   // T
        System.out.println(nume.charAt(6));   // V
    }
}
```

**charAt(i)** dă înapoi un **char** (un singur caracter). Pentru scopurile noastre, te poți gândi la el ca la un string mititel

---

Compararea string-urilor — și **cea mai des întâlnită capcană din Java din toate timpurile**

```java
public class Main {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";

        if (a == b) {
            System.out.println("equal");
        } else {
            System.out.println("not equal");
        }
    }
}
```

Asta **ar putea** afișa **equal**, dar **e greșit**. Cu obiectele (și **String** este un obiect în Java), **==** compară dacă sunt **același obiect din memorie**, nu dacă au același conținut. Modul corect este

```java
public class Main {
    public static void main(String[] args) {
        if (a.equals(b)) {
            System.out.println("equal");
        }
    }
}
```

**Folosește întotdeauna .equals() ca să compari string-uri în Java**. Memorează asta. Îți vei mulțumi mai târziu :)

---

## Misiune: Decodorul de Semnal

Un nume de membru al echipajului a sosit bruiat prin stația de comunicații. Modulul de decriptare are nevoie să-l afișezi în fiecare format ca analiștii să-l poată verifica încrucișat.

Afișează aceste șase valori pe **linii separate**: cu majuscule, cu minuscule, lungimea, primul caracter, primele 5 caractere și ultimele 5 caractere (pozițiile 6 până la 11).

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `nume` — numele membrului echipajului (String)

**Exemplu**

Cu `nume = "lance vance"`, programul tău ar trebui să afișeze

```text
LANCE VANCE
lance vance
11
l
lance
vance
```
