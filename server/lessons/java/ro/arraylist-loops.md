Acum că știi cum să creezi un ArrayList și să adaugi lucruri în el, hai să vorbim despre **parcurgerea lui cu o buclă**. Există două moduri principale, și ambele sunt utile

---

**Modul 1: Bucla for clasică cu .get(i)**

Asta funcționează exact ca parcurgerea unui array, dar folosești **.size()** în loc de **.length** și **.get(i)** în loc de **[i]**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        for (int i = 0; i < echipaj.size(); i++) {
            System.out.println(i + ": " + echipaj.get(i));
        }
    }
}
```

Output

```text
0: Tommy Vercetti
1: Lance Vance
2: Phil Cassidy
```

Folosește asta când ai nevoie de **indice** — de exemplu, ca să numerotezi elemente sau să accesezi poziții specifice

---

**Modul 2: Bucla for-each**

Java are o scurtătură numită bucla **for-each** (numită și „bucla for îmbunătățită"). Este mai curată când vrei doar fiecare element și nu îți pasă de indice

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<String>();
        echipaj.add("Tommy Vercetti");
        echipaj.add("Lance Vance");
        echipaj.add("Phil Cassidy");

        for (String nume : echipaj) {
            System.out.println("Membru: " + nume);
        }
    }
}
```

Output

```text
Membru: Tommy Vercetti
Membru: Lance Vance
Membru: Phil Cassidy
```

Citește **for (String nume : echipaj)** ca: „pentru fiecare String numit nume **din** echipaj." Este ca **for nume in echipaj:** din Python — aproape identic

---

Tabel de comparație rapidă

|          | Array   | ArrayList    |
| -------- | ------- | ------------ |
| Mărime   | Fixă    | Dinamică     |
| Lungime  | .length | .size()      |
| Acces    | arr[i]  | lista.get(i) |
| For-each | merge   | merge        |

Bucla for-each funcționează cu **ambele**, array-uri și ArrayList-uri — Java se ocupă de detalii

```java
public class Main {
    public static void main(String[] args) {
        // For-each cu un array obișnuit
        String[] nume = {"Tommy", "Lance"};
        for (String n : nume) {
            System.out.println(n);
        }

        // For-each cu un ArrayList
        ArrayList<String> nume2 = new ArrayList<String>();
        nume2.add("Tommy");
        nume2.add("Lance");
        for (String n : nume2) {
            System.out.println(n);
        }
    }
}
```

Aceeași sintaxă, ambele funcționează perfect

---

Iată un exemplu practic. Hai să filtrăm un ArrayList — păstrăm doar elementele pe care le vrem

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numere = new ArrayList<Integer>();
        numere.add(10);
        numere.add(25);
        numere.add(30);
        numere.add(7);
        numere.add(42);

        for (int num : numere) {
            if (num > 20) {
                System.out.println(num + " este mare");
            }
        }
    }
}
```

Output

```text
25 este mare
30 este mare
42 este mare
```

Observă că, deși am declarat lista ca **ArrayList\<Integer\>**, putem folosi **int num** în bucla for-each. Java dezambalează automat Integer-ul într-un int. La îndemână

---

## Misiune: Filtru de Frecvențe

Antena stației a captat o listă de citiri de frecvență. Comanda se interesează doar de frecvențele **pare** — filtrează-le pe cele impare.

Creează un `ArrayList<Integer>` numit `numere`, adaugă citirile, apoi parcurge-l și afișează **doar numerele pare**, fiecare pe linia lui. Un număr este par dacă `num % 2 == 0`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- Citiri de adăugat: `3, 12, 7, 24, 5, 18, 11, 30`

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
12
24
18
30
```
