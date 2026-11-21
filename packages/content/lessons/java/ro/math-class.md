Ai întâlnit deja `Math.pow` și `Math.max`. Ele stau în clasa **Math**, o trusă cu ajutoare gata făcute pentru numere. Nu creezi nimic ca s-o folosești: scrii `Math.` și numele ajutorului

---

Distanțe și mărimi: **abs** și **sqrt**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.abs(-7));      // 7
        System.out.println(Math.abs(7));       // 7
        System.out.println(Math.sqrt(25));     // 5.0
        System.out.println(Math.sqrt(2));      // 1.4142135623730951
    }
}
```

Ieșire

```text
7
7
5.0
1.4142135623730951
```

`Math.abs` scoate semnul minus, deci spune cât de departe e un număr de zero. `Math.sqrt` dă radicalul, mereu ca double

---

Rotunjiri: **round**, **floor** și **ceil**

```java
public class Main {
    public static void main(String[] args) {
        double pret = 7.5;
        System.out.println(Math.round(pret));   // 8
        System.out.println(Math.floor(pret));   // 7.0
        System.out.println(Math.ceil(pret));    // 8.0
        System.out.println(Math.ceil(7.1));     // 8.0
    }
}
```

Ieșire

```text
8
7.0
8.0
8.0
```

- `Math.round` merge la cel mai apropiat număr întreg și îl dă înapoi fără zecimale
- `Math.floor` merge mereu în jos
- `Math.ceil` merge mereu în sus, chiar și de la 7.1. Gândește-te la autobuze: 71 de oameni au nevoie de 8 autobuze de câte 10, nu de 7

`floor` și `ceil` dau înapoi un double, așa că se afișează cu `.0`

---

Mai mare, mai mic, puteri

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.max(4, 9));    // 9
        System.out.println(Math.min(4, 9));    // 4
        System.out.println(Math.pow(3, 2));    // 9.0
        System.out.println(Math.PI);           // 3.141592653589793
    }
}
```

Ieșire

```text
9
4
9.0
3.141592653589793
```

`Math.PI` nu e o metodă, așa că nu are paranteze. E o valoare fixă păstrată în clasa Math

Mai există și `Math.random()`, care dă un double la întâmplare, de la 0 până la 1 (fără 1). Jocurile îl folosesc pentru zaruri și pradă. Valoarea lui e alta la fiecare rulare, așa că nu-l vei vedea într-o misiune aici

---

O folosire clasică: distanța în linie dreaptă între două puncte. Mergi `dx` în lateral și `dy` în sus, iar distanța e `sqrt(dx² + dy²)`

```java
public class Main {
    public static void main(String[] args) {
        int dx = 6;
        int dy = 8;
        double distanta = Math.sqrt(dx * dx + dy * dy);
        System.out.println(distanta);
    }
}
```

Ieșire

```text
10.0
```

---

## Misiune: Zborul cu elicopterul

Tommy trebuie să ajungă dintr-un colț al orașului în altul. Orașul e o rețea de blocuri. Stochează punctul de plecare în două variabile `int`, `x1` și `y1`, iar locul unde merge în `x2` și `y2`.

Afișează trei linii:

1. `Pe jos: N blocuri`: pe jos poate merge doar pe străzi, așa că merge distanța în lateral plus distanța în sus sau în jos
2. `In zbor: N`: elicopterul zboară în linie dreaptă. Rotunjește la cel mai apropiat număr întreg
3. `Cea mai lunga bucata: N`: cea mai lungă dintre cele două porțiuni de mers, în lateral sau în sus și în jos

Punctele pot fi în orice ordine, așa că o distanță în lateral poate ieși negativă. Fă-o pozitivă cu clasa Math.

**Exemplu** pentru `x1 = 0, y1 = 0, x2 = 3, y2 = 4`

```text
Pe jos: 7 blocuri
In zbor: 5
Cea mai lunga bucata: 4
```

**Exemplu** pentru `x1 = 5, y1 = 1, x2 = 2, y2 = 3`

```text
Pe jos: 5 blocuri
In zbor: 4
Cea mai lunga bucata: 3
```

**Exemplu** pentru `x1 = 2, y1 = 2, x2 = 2, y2 = 2`

```text
Pe jos: 0 blocuri
In zbor: 0
Cea mai lunga bucata: 0
```
