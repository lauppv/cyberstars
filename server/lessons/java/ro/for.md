Bun venit la unul dintre cele **mai importante** concepte din programare — bucla **for**. Cu ea, putem cere calculatorului să facă ceva **de multe ori**, **automat**

De ce contează? Imaginează-ți că vrem să afișăm toate numerele de la **1** la **10**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);
        // ... și tot așa, de zece ori
    }
}
```

Obositor. Acum imaginează-ți de la **1** la **1000**. Nu există nicio șansă să scriem **1000 de println**. Aici ne salvează **for**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
```

Rulează-l. Vei vedea numerele de la **1** la **10**, câte unul pe linie

---

Bucla **for** din Java are **trei părți** între paranteze, separate prin **;**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
```

1. **int i = 1** — **punctul de pornire**. Creăm o nouă variabilă **i** și o setăm la **1**
2. **i <= 10** — **condiția**. Atât timp cât aceasta este **adevărată**, bucla continuă să ruleze
3. **i++** — ce să facă **după fiecare iterație**. Aici creștem **i** cu 1

Citit ca o poveste: "pornește cu **i = 1**. Cât timp **i <= 10**, rulează corpul. După fiecare rulare, fă **i++**"

Așadar **i** ia valorile **1, 2, 3, 4, 5, 6, 7, 8, 9, 10**. Când **i** devine **11**, condiția **11 <= 10** este **falsă**, iar bucla se termină

Acesta este **diferit față de Python**. În Python scriam **for i in range(1, 11)**. În Java suntem mai expliciți, dar și mai flexibili. Putem număra din 2 în 2, putem număra descrescător, putem face orice vrem

```java
public class Main {
    public static void main(String[] args) {
        // numărând din 2 în 2
        for (int i = 0; i <= 10; i = i + 2) {
            System.out.println(i);
        }
    }
}
```

Rezultat: 0, 2, 4, 6, 8, 10

```java
public class Main {
    public static void main(String[] args) {
        // numărând descrescător
        for (int i = 10; i >= 1; i--) {
            System.out.println(i);
        }
    }
}
```

Rezultat: 10, 9, 8, ..., 1. **i--** înseamnă **i = i - 1**

---

O greșeală frecventă: uitarea actualizării lui **i**

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; ) {
            System.out.println(i);
        }
    }
}
```

Aceasta este o **buclă infinită**. **i** rămâne **1** pentru totdeauna, condiția rămâne **adevărată** pentru totdeauna, iar programul afișează **1** până când îl oprești tu. Rulează-l (scurt) ca să vezi ce se întâmplă, apoi închide-l :)

---

## Misiune: Scanarea Sectoarelor

Scannerul stației parcurge **toate sectoarele** de la `sector_start` la `sector_final`. Majoritatea sectoarelor primesc o citire numerică normală, dar două sectoare speciale (`sector_alerta1` și `sector_alerta2`) declanșează în schimb un semnal **Pizza Margherita** în loc de număr.

Scrie un program care folosește o buclă **for** ca să parcurgă fiecare număr de sector de la `sector_start` la `sector_final`. Pentru fiecare sector:

- dacă sectorul este `sector_alerta1` sau `sector_alerta2` → afișează `Pizza Margherita`
- altfel → afișează numărul sectorului

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `sector_start` — primul sector de scanat
- `sector_final` — ultimul sector de scanat
- `sector_alerta1` — primul sector special
- `sector_alerta2` — al doilea sector special

**Exemplu**

Cu `sector_start = 0`, `sector_final = 100`, `sector_alerta1 = 10` și `sector_alerta2 = 50`, primele câteva linii din rezultat ar trebui să fie

```text
0
1
2
...
9
Pizza Margherita
11
...
```

iar la sectorul 50 vei vedea alt `Pizza Margherita`
