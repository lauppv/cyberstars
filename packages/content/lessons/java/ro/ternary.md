Adesea un if/else alege doar una din două valori. Java are un fel scurt de a scrie asta: **operatorul ternar**, `conditie ? valoareDacaAdevarat : valoareDacaFals`

---

Iată aceeași alegere scrisă în ambele feluri

```java
public class Main {
    public static void main(String[] args) {
        int bani = 120;

        String plan;
        if (bani >= 100) {
            plan = "cumpar o masina";
        } else {
            plan = "iau autobuzul";
        }
        System.out.println(plan);

        String plan2 = bani >= 100 ? "cumpar o masina" : "iau autobuzul";
        System.out.println(plan2);
    }
}
```

Ieșire

```text
cumpar o masina
cumpar o masina
```

Citește `bani >= 100 ? "cumpar o masina" : "iau autobuzul"` ca pe o întrebare: are măcar 100? Dacă da, valoarea e `"cumpar o masina"`. Dacă nu, e `"iau autobuzul"`. Totul e o singură valoare, așa că o poți pune în dreapta lui `=`

---

Fiindcă e o valoare, o poți folosi direct într-un println sau într-o sumă

```java
public class Main {
    public static void main(String[] args) {
        int vieti = 1;
        System.out.println("Ai " + vieti + (vieti == 1 ? " viata" : " vieti"));

        int pret = 50;
        boolean membru = true;
        int dePlata = pret - (membru ? 10 : 0);
        System.out.println("De plata: " + dePlata);
    }
}
```

Ieșire

```text
Ai 1 viata
De plata: 40
```

Pune ternarul între paranteze când stă într-o expresie mai lungă. Fără ele, `"Ai " + vieti + vieti == 1 ? ...` ar fi citit în ordinea greșită

---

Ambele valori trebuie să se potrivească în același loc. Dacă ternarul merge într-un `int`, ambele părți trebuie să fie numere. Dacă merge într-un `String`, ambele trebuie să fie text

Un ternar e grozav pentru o alegere mică între două valori. Pentru o alegere care rulează mai multe linii de cod, folosește în continuare if/else: se citește mai ușor

---

## Misiune: Nivelul de urmărire

Poliția din Vice City e pe urmele lui Tommy. Stochează numărul de stele de urmărire într-un `int` numit `stele`. Afișează două linii:

1. `Urmarit: N stea` când e exact o stea, și `Urmarit: N stele` pentru orice alt număr
2. `Politia: urmareste` când e măcar o stea, și `Politia: linistita` când nu e niciuna

Fă fiecare alegere cu operatorul ternar, nu cu if.

**Exemplu** pentru `stele = 3`

```text
Urmarit: 3 stele
Politia: urmareste
```

**Exemplu** pentru `stele = 1`

```text
Urmarit: 1 stea
Politia: urmareste
```

**Exemplu** pentru `stele = 0`

```text
Urmarit: 0 stele
Politia: linistita
```
