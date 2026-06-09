Avem un array de nume. Vrem să salutăm pe fiecare. **Am putea** face

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

Repetitiv. **Interzis**, cum am spus în lecțiile anterioare :)

Bucla clasică **for** din Java merge mână în mână cu array-urile

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

Observă că am folosit **i < nume.length**, **nu** **i <= nume.length**. De ce? Pentru că indicii merg de la **0** la **length - 1**. Pentru un array de **3** elemente, indicii sunt **0, 1, 2**. **i = 3** este în afara limitelor. **i < length** se oprește la locul potrivit

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

Un șablon clasic: **adunarea** numerelor

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

Output **100**. Începe cu **total = 0**, parcurge fiecare preț, adaugă-l la total. Vei scrie acest gen de buclă **mult** în cariera ta. Citește-o linie cu linie până devine a doua natură :)

---

## Misiune: Raport de Telemetrie

Stația tocmai a primit un lot de `scoruri` de la senzori. Sarcina ta este să produci un raport rapid de telemetrie: listează fiecare citire, apoi arată **totalul** și **media**.

1. Afișează fiecare scor pe linia lui
2. Afișează **totalul** tuturor scorurilor
3. Afișează **media** ca număr zecimal (folosește o conversie la `double`)

**Sfat**: dacă împarți `total / scoruri.length` ca int-uri, obții **79**, nu **79.0**. Convertește o parte la `double`:

```text
double media = (double) total / scoruri.length;
```

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `scoruri` — un array `int[]` de citiri de la senzori

**Exemplu**

Cu `scoruri = {80, 95, 60, 72, 88}`, programul tău ar trebui să afișeze

```text
80
95
60
72
88
395
79.0
```
