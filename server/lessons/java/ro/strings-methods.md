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

Output **14**. Spațiile contează și ele. Observă **parantezele** **()** de la final — pentru String, **length** este o **metodă**, așa că o apelăm cu paranteze

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

**Important**: aceste metode **nu** schimbă variabila originală. Ele dau înapoi un string **nou**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "tommy";
        nume.toUpperCase();
        System.out.println(nume);   // tot tommy
    }
}
```

Ca să păstrăm efectiv versiunea cu majuscule, trebuie să **reasignăm**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "tommy";
        nume = nume.toUpperCase();
        System.out.println(nume);   // TOMMY
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

**substring(start, end)** dă caracterele de la poziția **start** până la (dar **fără** a include) poziția **end** — capătul este exclusiv

**substring(start)** cu un singur argument dă tot de la **start** până la finalul string-ului

Numărarea începe de la **0**. **nume.substring(0, 5)** înseamnă pozițiile **0, 1, 2, 3, 4** care formează **Tommy**

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

**charAt(i)** dă înapoi un **char** (un singur caracter). Combinat cu **length()**, poți lua și ultimul caracter: **nume.charAt(nume.length() - 1)**

---

Compararea string-urilor — și **cea mai des întâlnită capcană din Java din toate timpurile**

```java
public class Main {
    public static void main(String[] args) {
        String a = "salut";
        String b = "salut";

        if (a == b) {
            System.out.println("egal");
        } else {
            System.out.println("nu e egal");
        }
    }
}
```

Asta **ar putea** afișa **egal**, dar **e greșit**. Cu obiectele (și **String** este un obiect în Java), **==** compară dacă sunt **același obiect din memorie**, nu dacă au același conținut. Modul corect este

```java
public class Main {
    public static void main(String[] args) {
        String a = "salut";
        String b = "salut";

        if (a.equals(b)) {
            System.out.println("egal");
        }
    }
}
```

**Folosește întotdeauna .equals() ca să compari string-uri în Java**. Memorează asta de pe acum

---

## Misiune: Decodorul de Semnal

Un nume a sosit bruiat prin stația de comunicații a lui Tommy. Modulul de decriptare are nevoie să-l afișezi în mai multe formate, ca analiștii să-l poată verifica.

Stochează numele într-un String. Apoi afișează aceste șase valori pe **linii separate**, în această ordine:

- numele cu majuscule
- numele cu minuscule
- lungimea numelui
- primul caracter
- primele **5** caractere
- ultimele **5** caractere

Pentru „ultimele 5 caractere" folosește **length()** ca să calculezi poziția de start, ca să meargă pentru orice nume (de cel puțin 5 litere).

**Exemplu** pentru numele `lance vance`:

```text
LANCE VANCE
lance vance
11
l
lance
vance
```

**Exemplu** pentru numele `tommy vercetti`:

```text
TOMMY VERCETTI
tommy vercetti
14
t
tommy
cetti
```

**Exemplu** pentru numele `lance` (exact 5 litere — primele 5 și ultimele 5 sunt tot numele):

```text
LANCE
lance
5
l
lance
lance
```
