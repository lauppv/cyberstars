Când lucrezi cu date, uneori trebuie să convertești o valoare dintr-un tip în altul — un preț zecimal transformat în număr întreg, sau un obiect general tratat ca tip specific. Această conversie se numește **casting**. Java îi pasă foarte mult dacă conversia este sigură — și te obligă să fii explicit când nu e

---

**Lărgire** (sigură, automată): trecerea de la un tip mai mic la unul mai mare. Nu se pierde nimic

```java
public class Main {
    public static void main(String[] args) {
        int x = 42;
        double y = x;  // int -> double, automat
        System.out.println(y);
    }
}
```

Output

```text
42.0
```

Java face asta automat, pentru că un `double` poate ține orice valoare `int`. E ca și cum ai turna o ceașcă mică de apă într-o găleată mare — nimic nu se varsă

Lanțul lărgirii: `byte -> short -> int -> long -> float -> double`

---

**Îngustare** (periculoasă, manuală): trecerea de la un tip mai mare la unul mai mic. Date ar putea fi pierdute, așa că Java te obligă să fii explicit

```java
public class Main {
    public static void main(String[] args) {
        double pret = 9.99;
        int rotunjit = (int) pret;  // conversie explicita
        System.out.println(rotunjit);
    }
}
```

Output

```text
9
```

`(int)` este operatorul de conversie. Îi spui lui Java „știu că asta ar putea pierde date, fă-o oricum." Fără el, Java refuză să compileze

Convertirea unui double în int **trunchiază** (taie zecimala), nu rotunjește. `9.99` devine `9`, nu `10`. Dacă vrei rotunjire reală, folosește `Math.round()`

---

Casting funcționează și cu **obiecte** în ierarhiile de moștenire

```java
class Animal {
    void vorbeste() { System.out.println("..."); }
}

class Caine extends Animal {
    void adu() { System.out.println("Aduc mingea!"); }
}
```

**Upcasting** (copil la părinte) — mereu sigur, automat:

```java
public class Main {
    public static void main(String[] args) {
        Caine c = new Caine();
        Animal a = c;  // automat, ca largirea
        a.vorbeste();  // functioneaza
        // a.adu();  // NU COMPILEAZA -- Animal nu stie despre adu()
    }
}
```

**Downcasting** (părinte la copil) — periculos, manual:

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Caine();   // obiectul ESTE un Caine
        Caine c = (Caine) a;      // conversie explicita, ca ingustarea
        c.adu();                  // functioneaza, obiectul chiar e un Caine
    }
}
```

Output

```text
Aduc mingea!
```

Dar dacă obiectul nu este de fapt un `Caine`, primești o **ClassCastException** la rulare. De aceea verifici mai întâi cu **instanceof**

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Animal();
        if (a instanceof Caine) {
            Caine c = (Caine) a;
            c.adu();
        } else {
            System.out.println("Nu e caine");
        }
    }
}
```

Output

```text
Nu e caine
```

`instanceof` returnează `true` doar dacă obiectul chiar este de acel tip. E ca un control de identitate — verifici înainte să acționezi

---

Referință rapidă

| Conversie       | Direcție    | Sigură?              | Sintaxă                |
| --------------- | ----------- | -------------------- | ---------------------- |
| int la double   | Lărgire     | Da                   | `double d = x;`        |
| double la int   | Îngustare   | Nu (pierde zecimale) | `int i = (int) d;`     |
| Caine la Animal | Upcasting   | Da                   | `Animal a = c;`        |
| Animal la Caine | Downcasting | Poate                | `Caine c = (Caine) a;` |

---

## Misiune: Echipa din Vice City

Tommy are o echipă de oameni în Vice City. Fiecare are un nume, dar unii sunt șoferi și știu să conducă o mașină anume. Lance Vance e șofer pe Infernus, Mercedes Cortez nu conduce, iar Hilary King e șofer pe Sentinel

Construiește o clasă de bază pentru membrii echipei și una derivată pentru șoferi. În `main`, creează câțiva membri amestecați, parcurge-i și folosește `instanceof` ca să afișezi mașina doar la șoferi

**Exemplu**

```text
Nume: Lance Vance
Masina: Infernus
Nume: Mercedes Cortez
Nume: Hilary King
Masina: Sentinel
```
