O metodă poate apela alte metode. Poate să se apeleze și **pe ea însăși**. Asta se numește **recursivitate**. Sună ciudat la început, dar e un fel curat de a rezolva o problemă care conține o copie mai mică a aceleiași probleme

---

Iată o numărătoare inversă scrisă cu recursivitate în loc de o buclă

```java
public class Main {
    static void numaratoare(int n) {
        if (n == 0) {
            System.out.println("Decolare!");
            return;
        }
        System.out.println(n);
        numaratoare(n - 1);
    }

    public static void main(String[] args) {
        numaratoare(3);
    }
}
```

Ieșire

```text
3
2
1
Decolare!
```

`numaratoare(3)` afișează 3 și apoi apelează `numaratoare(2)`, care afișează 2 și apelează `numaratoare(1)`, și tot așa. Când `n` ajunge la 0, metoda afișează `Decolare!` și nu se mai apelează

---

Orice metodă recursivă are nevoie de două părți:

1. **Cazul de bază**: problema mică la care poți răspunde pe loc, fără să te apelezi. Aici, `n == 0`
2. **Pasul recursiv**: te apelezi cu o problemă mai mică, una care se apropie de cazul de bază. Aici, `n - 1`

Dacă uiți cazul de bază, sau te apelezi cu o problemă care nu se micșorează niciodată, metoda se apelează la nesfârșit. Java rămâne fără loc pentru toate apelurile și se oprește cu un `StackOverflowError`

---

O metodă recursivă poate da înapoi și o valoare. Factorialul lui n e `n × (n-1) × ... × 1`. Observă că `5!` e doar `5 × 4!`. Asta e copia mai mică a problemei

```java
public class Main {
    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
```

Ieșire

```text
120
```

`factorial(5)` așteaptă după `factorial(4)`, care așteaptă după `factorial(3)`, până la `factorial(1)`, care răspunde 1. Apoi răspunsurile urcă înapoi: 2, 6, 24, 120

---

Așteptarea asta e importantă. Fiecare apel își păstrează propriul `n` și așteaptă până se întoarce apelul pe care l-a făcut. Așa că un cod scris **după** apelul recursiv rulează la întoarcere, în ordine inversă

```java
public class Main {
    static void coboara(int etaj) {
        if (etaj == 0) {
            System.out.println("Parter");
            return;
        }
        System.out.println("Cobor de la " + etaj);
        coboara(etaj - 1);
        System.out.println("Urc la " + etaj);
    }

    public static void main(String[] args) {
        coboara(2);
    }
}
```

Ieșire

```text
Cobor de la 2
Cobor de la 1
Parter
Urc la 1
Urc la 2
```

---

## Misiune: Cutii în cutii

Tommy a ascuns banii într-o cutie, într-o cutie, într-o cutie. Scrie o metodă recursivă `deschide` care primește câte cutii au mai rămas. Deschiderea unei cutii afișează `Deschid cutia N` și apoi deschide cutia următoare din ea. Când nu mai rămâne nicio cutie, afișează `Am gasit banii!`. La ieșire, fiecare cutie afișează `Inchid cutia N`.

Stochează numărul de cutii într-un `int` numit `cutii` și apelează `deschide` cu el. Nu folosi o buclă.

**Exemplu** pentru `cutii = 3`

```text
Deschid cutia 3
Deschid cutia 2
Deschid cutia 1
Am gasit banii!
Inchid cutia 1
Inchid cutia 2
Inchid cutia 3
```

**Exemplu** pentru `cutii = 1`

```text
Deschid cutia 1
Am gasit banii!
Inchid cutia 1
```

**Exemplu** pentru `cutii = 0`

```text
Am gasit banii!
```
