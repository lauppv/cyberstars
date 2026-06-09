Până acum, fiecare variabilă ținea **un** singur lucru. Dar dacă vrem să stocăm **toate** personajele din GTA Vice City? Să scriem **nume1**, **nume2**, **nume3**... este urât. Avem nevoie de un **array**

Un **array** este o colecție de valori de **același tip**, stocate într-o singură variabilă

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy" };

        System.out.println(nume[0]);
        System.out.println(nume[1]);
        System.out.println(nume[2]);
    }
}
```

Output

```text
Tommy Vercetti
Lance Vance
Cortez
```

Două lucruri noi

- Tipul este **String[]** (observă **[]**) — „un array de String-uri"
- Folosim **{ }** ca să listăm valorile, separate prin virgule

La fel ca în Python, **numărarea începe de la 0**. **nume[0]** este primul element, **nume[1]** al doilea, și așa mai departe

---

Array-urile Java au o **mărime fixă**. Odată ce le creezi, nu poți adăuga sau elimina elemente. (Pentru colecții dinamice, Java are **ArrayList**, dar deocamdată rămânem la array-uri)

Câte elemente are array-ul? Folosește **.length**

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };
        System.out.println(nume.length);   // 3
    }
}
```

**Observă**: **nume.length** **nu are paranteze**, spre deosebire de **String.length()**. Da, asta este enervant de inconsecvent — array-urile folosesc un **câmp** numit **length**, în timp ce String-urile au o **metodă** numită **length()**. Bun venit la Java :)

---

Putem de asemenea să creăm un array cu o mărime fixă, apoi să-l umplem mai târziu

```java
public class Main {
    public static void main(String[] args) {
        int[] scoruri = new int[5];   // un array de 5 int-uri, toate zero implicit
        scoruri[0] = 80;
        scoruri[1] = 95;
        scoruri[2] = 60;
        scoruri[3] = 72;
        scoruri[4] = 88;
        System.out.println(scoruri[2]);   // 60
    }
}
```

**new int[5]** creează un array cu **5** sloturi. Implicit sunt umplute cu **0** pentru numere, **null** pentru obiecte (ca String-urile) și **false** pentru booleans

---

Putem **schimba** o valoare la orice indice

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };
        nume[1] = "Lance Vance Dance";
        System.out.println(nume[1]);   // Lance Vance Dance
    }
}
```

---

Ce se întâmplă dacă cerem un indice care nu există?

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };
        System.out.println(nume[10]);
    }
}
```

Rulează-l. Java aruncă o **ArrayIndexOutOfBoundsException** și se prăbușește. Citește eroarea :)

---

## Misiune: Registrul Echipajului

Stația are un registru al echipajului gol cu **3 sloturi**. Sarcina ta este să-l completezi și să faci o verificare rapidă a stării.

1. Setează `eroi[0]` la `"Shrek"`
2. Setează `eroi[1]` la `"Fiona"`
3. Setează `eroi[2]` la `"Donkey"`
4. Afișează **lungimea** array-ului
5. Afișează **primul** erou
6. Afișează **ultimul** erou

**Input** (deja setat în partea de sus a codului tău):

- `eroi` — un array `String[]` cu 3 sloturi goale

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
3
Shrek
Donkey
```
