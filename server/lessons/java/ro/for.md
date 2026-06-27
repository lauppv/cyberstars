Bun venit la unul dintre cele **mai importante** concepte din programare — bucla **for**. Cu ea, putem cere calculatorului să facă ceva **de multe ori**, **automat**

De ce contează? Imaginează-ți că vrem să afișăm toate numerele de la **1** la **10**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);
        // ... si tot asa, de zece ori
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

---

Cele trei părți sunt complet sub controlul tău. Putem număra din 2 în 2, putem număra descrescător, putem face orice vrem

```java
public class Main {
    public static void main(String[] args) {
        // numarand din 2 in 2
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
        // numarand descrescator
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

Aceasta este o **buclă infinită**. **i** rămâne **1** pentru totdeauna, condiția rămâne **adevărată** pentru totdeauna, iar programul afișează **1** până când îl oprești tu. Mereu asigură-te că ceva din buclă apropie condiția de a deveni **falsă**

---

Putem pune **orice** în corpul buclei, inclusiv un **if**. Aici parcurgem sectoarele de la 1 la 5 și marcăm sectorul 3 ca fiind cel de patrulat

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            if (i == 3) {
                System.out.println("Sector de patrulat");
            } else {
                System.out.println(i);
            }
        }
    }
}
```

Rezultat

```text
1
2
Sector de patrulat
4
5
```

---

## Misiune: Inspecția Garajului

Tommy inspectează garajul vilei Vercetti. Locurile de parcare sunt numerotate de la **1** până la un număr total. Pe unul dintre locuri e parcat **Infernus**-ul lui — acolo, în loc de număr, vrei să afișezi numele mașinii.

Stochează numărul total de locuri și locul pe care se află Infernus-ul. Apoi folosește o buclă **for** care parcurge locurile de la **1** la total. Pentru fiecare loc:

- dacă e locul unde stă Infernus-ul → afișează `Infernus`
- altfel → afișează numărul locului

**Exemplu** pentru **5** locuri, cu Infernus pe locul **3**:

```text
1
2
Infernus
4
5
```

**Exemplu** pentru **5** locuri, cu Infernus pe locul **1** (primul):

```text
Infernus
2
3
4
5
```

**Exemplu** pentru **5** locuri, cu Infernus pe locul **5** (ultimul):

```text
1
2
3
4
Infernus
```
