Buclele **for** sunt grozave când știm **de câte ori** vrem să repetăm. Dar uneori vrem să continuăm **atâta timp cât** ceva este adevărat, fără să știm dinainte câte iterații înseamnă asta. Aceasta este treaba lui **while**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i < 10) {
            System.out.println(i);
            i++;
        }
    }
}
```

Ieșire

```text
0
1
2
3
4
5
6
7
8
9
```

De ce nu apare **10**? Pentru că atunci când **i = 10**, condiția **10 < 10** este **falsă**, așa că ieșim. Dacă am fi vrut ca **10** să fie inclus, am fi pus condiția **i <= 10**

---

**while** rulează **atâta timp cât** condiția este **adevărată**

**Fii foarte atent**. Dacă uităm să actualizăm **i** în interiorul buclei, obținem o **buclă infinită**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i <= 100) {
            System.out.println(i);
            // am uitat i++
        }
    }
}
```

**i** rămâne **0** pentru totdeauna, așa că condiția este mereu **adevărată**, iar programul afișează **0** la nesfârșit. Oricând scrii un **while**, întreabă-te: "ce face ca această condiție să devină în cele din urmă falsă?". Dacă răspunsul este "nimic", ai o problemă

---

Când să alegi **for** vs **while**?

- **for** când știi numărul ("fă asta de 10 ori", "parcurge fiecare element al unui array")
- **while** când condiția de oprire depinde de ceva calculat în interiorul buclei ("continuă să întrebi utilizatorul până când tastează **quit**", "continuă să împarți la 2 până când numărul scade sub 1")

Ambele sunt la fel de puternice. Stilul și lizibilitatea decid pe care o alegi

---

Uneori, în mijlocul unei bucle, vrem să spunem „gata, oprește-te" sau „sari peste asta, treci la următoarea". Pentru asta avem **break** și **continue**

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

Ieșire

```text
0
1
2
3
4
```

I-am spus buclei să meargă până la **99**, dar de îndată ce **i** a devenit **5**, **break** a intrat în acțiune și bucla s-a terminat. Numerele **5, 6, 7, ..., 99** nu au fost niciodată afișate

Un exemplu real: căutarea unui nume într-un array. De îndată ce găsim ținta, nu mai are rost să verificăm restul

```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Cortez", "Phil", "Sonny" };
        String tinta = "Cortez";

        for (String n : nume) {
            if (n.equals(tinta)) {
                System.out.println("L-am gasit pe " + tinta);
                break;
            }
            System.out.println("Verific " + n);
        }
    }
}
```

Ieșire

```text
Verific Tommy
Verific Lance
L-am gasit pe Cortez
```

Bucla nu a verificat **Phil** și **Sonny** — am găsit deja ce voiam

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

Ieșire

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

**break** și **continue** funcționează la fel în **while**. O combinație utilă este **while (true)** — o buclă care, în mod normal, ar fi infinită — din care ieșim cu **break**

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

O capcană: într-un **while**, **continue** sare direct înapoi la condiție. Dacă nu ai actualizat deja contorul, condiția nu se schimbă niciodată și obții o buclă infinită. Așadar într-un **while**, actualizează contorul **înainte** de **continue**

---

## Misiune: Spargerea Seifului

Tommy a dat de seiful lui Diaz și încearcă combinațiile pe rând: **1**, apoi **2**, apoi **3**, și tot așa în sus. Nu știi dinainte câte încercări durează — exact genul de problemă pentru **while (true)** plus **break**.

Stochează combinația secretă a seifului. Apoi folosește o buclă **while (true)** care numără încercările pornind de la **1**. La fiecare încercare:

- dacă încercarea curentă este egală cu combinația secretă → afișează `Seif deschis` și ieși din buclă cu **break**
- altfel → afișează `Incerc N`, unde **N** este numărul încercării, apoi treci la următoarea

**Exemplu** pentru combinația secretă **3**:

```text
Incerc 1
Incerc 2
Seif deschis
```

**Exemplu** pentru combinația secretă **1** (se deschide din prima):

```text
Seif deschis
```

**Exemplu** pentru combinația secretă **5**:

```text
Incerc 1
Incerc 2
Incerc 3
Incerc 4
Seif deschis
```
