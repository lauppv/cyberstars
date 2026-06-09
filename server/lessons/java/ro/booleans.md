Un **boolean** este o valoare care poate fi doar **true** sau **false**. Le-am văzut deja înăuntrul condițiilor **if**. Java are propriul tip pentru ele, numit **boolean**

```java
public class Main {
    public static void main(String[] args) {
        boolean esteOnline = true;
        boolean areCheie = false;
        System.out.println(esteOnline);
        System.out.println(areCheie);
    }
}
```

**Important**: în Java, **true** și **false** se scriu **cu literă mică**. (În Python erau **True** și **False** cu literă mare.) Nu le încurca

Condiții precum **varsta < 18** sau **x == 5** produc de asemenea booleans

```java
public class Main {
    public static void main(String[] args) {
        int varsta = 20;
        System.out.println(varsta < 18);    // false
        System.out.println(varsta >= 18);   // true
    }
}
```

---

Putem combina booleans cu operatori logici

- **&&** înseamnă **and** (ambele condiții trebuie să fie true)
- **||** înseamnă **or** (cel puțin una trebuie să fie true)
- **!** înseamnă **not** (inversează valoarea)

Imaginează-ți: pentru a conduce o mașină, trebuie să ai **cel puțin 18 ani ȘI să ai permis**

```java
public class Main {
    public static void main(String[] args) {
        int varsta = 20;
        boolean arePermis = true;

        if (varsta >= 18 && arePermis) {
            System.out.println("Poti conduce");
        } else {
            System.out.println("Scuze, azi nu conduci");
        }
    }
}
```

Ambele condiții trebuie să fie **true** pentru ca **&&** să fie **true**. Dacă măcar una este false, întregul lucru este false

---

**||** (or) este mai relaxat. Doar **una** dintre condiții fiind true este suficient

```java
public class Main {
    public static void main(String[] args) {
        boolean esteVIP = false;
        boolean areInvitatie = true;

        if (esteVIP || areInvitatie) {
            System.out.println("Bun venit in club");
        } else {
            System.out.println("Acces refuzat");
        }
    }
}
```

**esteVIP** este false, **areInvitatie** este true, așa că **or**-ul este true și persoana intră

---

**!** inversează un boolean. **!true** devine **false**, **!false** devine **true**

```java
public class Main {
    public static void main(String[] args) {
        boolean esteAutentificat = false;
        if (!esteAutentificat) {
            System.out.println("Te rog autentifica-te mai intai");
        }
    }
}
```

Se citește aproape ca în limba română: _dacă nu este autentificat, autentifică-te_

---

Tabelele de adevăr, doar ca să le avem într-un singur loc

```text
true  && true  = true
true  && false = false
false && true  = false
false && false = false

true  || true  = true
true  || false = true
false || true  = true
false || false = false

!true  = false
!false = true
```

---

## Misiune: Poarta de Acces a Stației

Scrii sistemul de acces pentru stație. O persoană poate intra dacă este **angajat ȘI este zi lucrătoare**, SAU dacă este **oaspete CU o invitație**.

Scrie un `if / else` folosind `&&` și `||` ca să verifici condițiile.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `esteAngajat` — dacă persoana este angajat (boolean)
- `esteZiLucratoare` — dacă azi este zi lucrătoare (boolean)
- `esteOaspete` — dacă persoana este oaspete (boolean)
- `areInvitatie` — dacă are o invitație (boolean)

**Exemplu**

Cu `esteAngajat = true`, `esteZiLucratoare = true`, `esteOaspete = false`, `areInvitatie = false`, programul tău ar trebui să afișeze

```text
Acces permis
```
