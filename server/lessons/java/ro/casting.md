Casting înseamnă convertirea unei valori dintr-un tip în altul. În Python ai scrie `int(3.14)` sau `float(42)`. Java are propriul mod de a face asta și îi pasă FOARTE mult dacă conversia este sigură

---

**Lărgire** (sigură, automată): trecerea de la un tip mai mic la unul mai mare. Nu se pierde nicio dată

```java
public class Main {
    public static void main(String[] args) {
        int x = 42;
        double y = x;  // int -> double, automat
        System.out.println(y);  // 42.0
    }
}
```

Java face asta automat, pentru că un `double` poate ține orice valoare `int`. Este ca și cum ai turna o ceașcă mică de apă într-o găleată mare — nimic nu se varsă

Lanțul lărgirii: `byte -> short -> int -> long -> float -> double`

---

**Îngustare** (periculoasă, manuală): trecerea de la un tip mai mare la unul mai mic. Datele AR PUTEA fi pierdute, așa că Java te obligă să fii explicit

```java
public class Main {
    public static void main(String[] args) {
        double pret = 9.99;
        int rotunjit = (int) pret;  // TREBUIE să convertești explicit
        System.out.println(rotunjit);  // 9  (partea zecimală este TĂIATĂ, nu rotunjită!)
    }
}
```

`(int)` este operatorul de conversie. Îi spui lui Java „știu că asta ar putea pierde date, fă-o oricum." Fără el, Java refuză să compileze

Important: convertirea unui double în int NU ROTUNJEȘTE — ci **trunchiază** (taie zecimala). `9.99` devine `9`, nu `10`. Dacă vrei rotunjire reală, folosește `Math.round()`

---

```java
public class Main {
    public static void main(String[] args) {
        // Lărgire — automată
        int scor = 42;
        double precis = scor;
        System.out.println(precis);  // 42.0

        // Îngustare — conversie manuală necesară
        double gpa = 3.87;
        int trunchiat = (int) gpa;
        System.out.println(trunchiat);  // 3
    }
}
```

---

Casting funcționează și cu **obiecte** în ierarhiile de moștenire

```java
class Animal {
    void vorbeste() { System.out.println("..."); }
}

class Caine extends Animal {
    void adu() { System.out.println("Aduc!"); }
}
```

**Upcasting** (copil la părinte, mereu sigur):

```java
public class Main {
    public static void main(String[] args) {
        Caine c = new Caine();
        Animal a = c;  // automat, ca lărgirea
        a.vorbeste();  // funcționează bine
        // a.adu();  // NU COMPILEAZĂ — Animal nu știe despre adu()
    }
}
```

**Downcasting** (părinte la copil, periculos):

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Caine();   // obiectul ESTE un câine
        Caine c = (Caine) a;      // conversie explicită, ca îngustarea
        c.adu();                  // funcționează pentru că este într-adevăr un Caine
    }
}
```

Dar dacă obiectul NU este de fapt un Caine, primești o **ClassCastException** la rulare. De aceea verifici mai întâi

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Pisica();
        if (a instanceof Caine) {
            Caine c = (Caine) a;  // asta nu va rula pentru că a este o Pisica
        }
    }
}
```

Este ca și cum Tommy Vercetti ar încerca să se dea drept Cortez. Deghizarea ar putea funcționa pentru o clipă, dar în cele din urmă lucrurile se prăbușesc

---

Iată o referință rapidă

| Conversie       | Direcție    | Sigură?              | Sintaxă                          |
| --------------- | ----------- | -------------------- | -------------------------------- |
| int la double   | Lărgire     | Da                   | `double d = intulMeu;`           |
| double la int   | Îngustare   | Nu (pierde zecimale) | `int i = (int) doubleulMeu;`     |
| Caine la Animal | Upcasting   | Da                   | `Animal a = caineleMeu;`         |
| Animal la Caine | Downcasting | Poate                | `Caine c = (Caine) animalulMeu;` |

---

## Misiune: Convertor de Greutate Cargo

Scannerul din docul de marfă raportează greutatea unui pachet ca zecimală (`9.99` kg), dar sistemul de manifest acceptă doar numere întregi. Între timp, balanța de precizie are nevoie de un scor cu număr întreg (`42`) extins la o citire zecimală.

1. Convertește `pret` (un double) la un int și afișează-l
2. Lărgește `scor` (un int) la un double și afișează-l

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `pret` — citirea greutății zecimale (double)
- `scor` — scorul cu număr întreg (int)

**Exemplu**

Cu `pret = 9.99` și `scor = 42`, programul tău ar trebui să afișeze

```text
9
42.0
```
