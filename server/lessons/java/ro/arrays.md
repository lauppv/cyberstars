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

**Numărarea începe de la 0**. **nume[0]** este primul element, **nume[1]** al doilea, și așa mai departe

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

**Observă**: **nume.length** **nu are paranteze**, spre deosebire de **String.length()**. Da, asta este enervant de inconsecvent — array-urile folosesc un **câmp** numit **length**, în timp ce String-urile au o **metodă** numită **length()**

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

Rulează-l. Java aruncă o **ArrayIndexOutOfBoundsException** și se prăbușește. Citește mereu mesajul de eroare — îți spune exact ce indice ai cerut și care era limita

---

Acum partea cea mai utilă: să parcurgem **toate** elementele. Să afișăm câte un salut pentru fiecare nume. **Am putea** scrie o linie pentru fiecare

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };
        System.out.println("Salut, " + nume[0] + "!");
        System.out.println("Salut, " + nume[1] + "!");
        System.out.println("Salut, " + nume[2] + "!");
    }
}
```

Repetitiv, și se rupe în clipa în care array-ul are mai multe elemente. Bucla **for** merge mână în mână cu array-urile

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };

        for (int i = 0; i < nume.length; i++) {
            System.out.println("Salut, " + nume[i] + "!");
        }
    }
}
```

Observă că am folosit **i < nume.length**, **nu** **i <= nume.length**. De ce? Pentru că indicii merg de la **0** la **length - 1**. Pentru un array de **3** elemente, indicii sunt **0, 1, 2**. **i = 3** este în afara limitelor. **i < length** se oprește exact la locul potrivit

---

Java are o formă mai scurtă când nu avem nevoie de indice — **bucla for îmbunătățită** (numită și **for-each**)

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez" };

        for (String n : nume) {
            System.out.println("Salut, " + n + "!");
        }
    }
}
```

Citește-o ca: „pentru fiecare **n** din **nume**, fă asta". Mai curată când vrem doar valoarea

Forma este **for (Tip variabila : array) { ... }**. **:**-ul din mijloc este esențial

Când alegi una față de cealaltă?

- Folosește **for clasic** când ai nevoie de **indice** (de exemplu, pentru a afișa numerele pozițiilor)
- Folosește **for îmbunătățit** când ai nevoie doar de **valoare**

Ambele sunt comune — codul Java le folosește pe amândouă în funcție de situație

---

Un șablon clasic: **adunarea** numerelor dintr-un array

```java
public class Main {
    public static void main(String[] args) {
        int[] preturi = { 10, 20, 30, 40 };
        int total = 0;
        for (int pret : preturi) {
            total = total + pret;
        }
        System.out.println(total);
    }
}
```

Output **100**. Începe cu **total = 0**, parcurge fiecare preț, adaugă-l la total. Vei scrie acest gen de buclă **mult** în cariera ta. Citește-o linie cu linie până devine a doua natură

---

## Misiune: Raportul Imperiului

Fiecare afacere a lui Tommy din Vice City și-a raportat încasările pe ziua de azi. Sarcina ta este să produci un raport rapid: listează fiecare sumă, apoi arată **totalul** și **media**.

Pune încasările într-un array de `int`. Apoi:

1. Afișează fiecare sumă pe linia ei
2. Afișează **totalul** tuturor sumelor
3. Afișează **media** ca număr zecimal (folosește o conversie la `double`)

**Sfat**: dacă împarți `total / numarul_de_sume` ca int-uri, obții un întreg trunchiat, nu un zecimal. Convertește o parte la `double` ca să păstrezi zecimalele:

```text
double media = (double) total / incasari.length;
```

**Exemplu**

Pentru încasările `{ 1200, 3400, 800, 2600 }`, programul tău ar trebui să afișeze

```text
1200
3400
800
2600
8000
2000.0
```

**Exemplu** pentru o singură afacere `{ 5000 }` (media este chiar acea sumă)

```text
5000
5000
5000.0
```

**Exemplu** când media **nu** este un număr rotund `{ 125, 200 }`

```text
125
200
325
162.5
```
