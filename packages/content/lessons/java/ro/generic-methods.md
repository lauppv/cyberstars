O clasă întreagă poate fi generică, dar la fel și o singură metodă. O **metodă generică** are propriul parametru de tip, așa că o singură metodă merge pentru String-uri, Integer-i, Masini, orice, iar Java verifică în continuare tipurile

---

Parametrul de tip stă în `< >` chiar înaintea tipului returnat

```java
public class Main {
    static <T> T primulDin(T[] lucruri) {
        return lucruri[0];
    }

    public static void main(String[] args) {
        String[] banda = { "Tommy", "Lance" };
        Integer[] scoruri = { 40, 15 };

        String sef = primulDin(banda);
        int maxim = primulDin(scoruri);
        System.out.println(sef);
        System.out.println(maxim);
    }
}
```

Ieșire

```text
Tommy
40
```

Nu-i spui lui Java ce e `T` când o apelezi. Vede un `String[]` și își dă seama că `T` e `String` de data asta, iar data viitoare `Integer`

---

O metodă generică poate primi și un `ArrayList<T>`, sau mai mulți parametri de tipul `T`

```java
import java.util.ArrayList;

public class Main {
    static <T> void afiseazaTot(ArrayList<T> lista) {
        for (T lucru : lista) {
            System.out.println("- " + lucru);
        }
    }

    public static void main(String[] args) {
        ArrayList<String> masini = new ArrayList<>();
        masini.add("Infernus");
        masini.add("Cheetah");
        afiseazaTot(masini);
    }
}
```

Ieșire

```text
- Infernus
- Cheetah
```

---

Într-o metodă generică nu știi nimic despre `T`, doar că e un obiect. Așa că poți apela metodele pe care le are orice obiect, ca `equals` și `toString`. E destul ca să compari lucruri

```java
public class Main {
    static <T> boolean contine(T[] lucruri, T cautat) {
        for (T lucru : lucruri) {
            if (lucru.equals(cautat)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Integer[] coduri = { 500, 1000, 2000 };
        System.out.println(contine(coduri, 1000));
        System.out.println(contine(coduri, 7));
    }
}
```

Ieșire

```text
true
false
```

Folosește `equals` aici, niciodată `==`. Amintește-ți capcana cu Integer: `==` pe două obiecte Integer poate spune fals pentru același număr

---

## Misiune: Numărăm orice

Scrie două metode generice:

- `numara(T[] lucruri, T cautat)` dă înapoi câte lucruri sunt egale cu cel căutat
- `ultimulDin(T[] lucruri)` dă înapoi ultimul lucru

În `main`, stochează niște cuvinte într-un array de `String` numit `cuvinte` și un cuvânt de căutat într-un `String` numit `cuvant`. Stochează niște numere într-un array de `Integer` numit `numere` și un număr de căutat într-un `Integer` numit `numar`. Folosind aceleași două metode pentru amândouă, afișează:

```text
<cuvant>: de N ori
<numar>: de N ori
Ultimul cuvant: <ultimul cuvant>
Ultimul numar: <ultimul numar>
```

Ambele array-uri au mereu cel puțin un element.

**Exemplu** pentru `cuvinte = { "bani", "pistol", "bani" }`, `cuvant = "bani"`, `numere = { 1000, 5, 1000, 1000 }` și `numar = 1000`

```text
bani: de 2 ori
1000: de 3 ori
Ultimul cuvant: bani
Ultimul numar: 1000
```

**Exemplu** pentru `cuvinte = { "caseta" }`, `cuvant = "bani"`, `numere = { 7, 8 }` și `numar = 8`

```text
bani: de 0 ori
8: de 1 ori
Ultimul cuvant: caseta
Ultimul numar: 8
```
