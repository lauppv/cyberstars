Buclele **for** și **while** își fac treaba de la început până la sfârșit. Dar dacă, în mijlocul unei bucle, vrem să spunem „ok, e suficient, oprește-te"? Sau „sari peste asta, treci la următoarea"?

Java ne oferă **break** și **continue** — aceleași nume, același comportament ca în multe limbaje

---

**break** **oprește** bucla complet. Iterațiile rămase nu se mai întâmplă

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            if (i == 5) {
                break;
            }
            System.out.println(i);
        }
    }
}
```

Output

```text
0
1
2
3
4
```

I-am spus buclei să meargă până la **99**, dar de îndată ce **i** a devenit **5**, **break** a intrat în acțiune și bucla s-a terminat. Numerele **5, 6, 7, ..., 99** nu au fost niciodată afișate

Un exemplu real: căutarea unui nume într-un array

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez", "Phil", "Sonny" };
        String tinta = "Cortez";

        for (String n : nume) {
            if (n.equals(tinta)) {
                System.out.println("L-am gasit pe " + tinta + "!");
                break;
            }
            System.out.println("Verific " + n + "...");
        }
    }
}
```

Output

```text
Verific Tommy...
Verific Lance...
L-am gasit pe Cortez!
```

Bucla nu a verificat **Phil** și **Sonny** — am găsit deja ce voiam. **break** ne-a economisit timp

---

**continue** este diferit. Nu oprește bucla — doar **sare peste restul** iterației curente și **trece la următoarea**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            if (i == 5) {
                continue;
            }
            System.out.println(i);
        }
    }
}
```

Output

```text
0
1
2
3
4
6
7
8
9
```

**5** lipsește. Când **i** a fost **5**, **continue** s-a declanșat, a sărit peste **System.out.println**, iar bucla a continuat de la **i = 6**

Un exemplu real: afișează doar numerele **pare**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i <= 10; i++) {
            if (i % 2 != 0) {
                continue;
            }
            System.out.println(i);
        }
    }
}
```

Output: **0 2 4 6 8 10**

---

Ambele cuvinte cheie funcționează la fel în **while**, nu doar în **for**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (true) {
            if (i >= 5) {
                break;
            }
            System.out.println(i);
            i++;
        }
    }
}
```

**while (true)** ar fi în mod normal infinit, dar **break** ne lasă să scăpăm

---

O mică avertizare: **break** și **continue** pot face codul mai greu de citit dacă abuzezi de ele. Folosește-le când fac logica mai clară, nu doar ca să fii deștept :)

---

## Misiune: Patrula Punților

Securitatea scanează punțile **1** până la `totalPunti`. Se aplică două reguli speciale:

1. Puntea `punteBlestemata` este sigilată — **sari peste ea** cu `continue`
2. Când ajungi la puntea `punteBlocaj`, se declanșează un blocaj — **oprește-te** imediat cu `break` (nu afișa acea punte)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `totalPunti` — câte punți de patrulat
- `punteBlestemata` — puntea de sărit
- `punteBlocaj` — puntea unde te oprești

**Exemplu**

Cu `totalPunti = 20`, `punteBlestemata = 13` și `punteBlocaj = 17`, programul tău ar trebui să afișeze

```text
1
2
3
4
5
6
7
8
9
10
11
12
14
15
16
```

**13** lipsește (sărit), iar **17, 18, 19, 20** nu apar niciodată (blocaj)
