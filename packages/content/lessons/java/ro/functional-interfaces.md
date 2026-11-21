Un lambda poate fi pus și într-o variabilă. Dar o variabilă are nevoie de un tip. Tipul unui lambda e o **interfață funcțională**: o interfață cu exact o metodă de completat

Java are unele gata făcute în `java.util.function`. Cele patru pe care le vei întâlni cel mai des

- `Predicate<T>`: primește un T, răspunde cu true sau false. Îl apelezi cu `test`
- `Function<T, R>`: primește un T, întoarce un R. O apelezi cu `apply`
- `Consumer<T>`: primește un T, nu întoarce nimic. Îl apelezi cu `accept`
- `Supplier<T>`: nu primește nimic, întoarce un T. Îl apelezi cu `get`

```java
import java.util.function.Function;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Predicate<Integer> eMare = n -> n > 1000;
        Function<Integer, Integer> dublu = n -> n * 2;

        System.out.println(eMare.test(5000));
        System.out.println(eMare.test(10));
        System.out.println(dublu.apply(21));
    }
}
```

Ieșire

```text
true
false
42
```

---

`Consumer` și `Supplier` merg la fel

```java
import java.util.function.Consumer;
import java.util.function.Supplier;

public class Main {
    public static void main(String[] args) {
        Consumer<String> striga = s -> System.out.println(s.toUpperCase() + "!");
        Supplier<String> sef = () -> "Tommy";

        striga.accept("mâinile sus");
        System.out.println(sef.get());
    }
}
```

Ieșire

```text
MÂINILE SUS!
Tommy
```

Mai există și `BiFunction<A, B, R>`, care primește două intrări. O apelezi cu `apply(a, b)`

---

De ce să pui un lambda într-o variabilă? Ca să poți da un comportament metodelor tale. Aici o singură metodă poate număra orice, iar lambda-ul decide ce se numără

```java
import java.util.function.Predicate;

public class Main {
    static int numara(int[] valori, Predicate<Integer> regula) {
        int n = 0;
        for (int v : valori) {
            if (regula.test(v)) {
                n++;
            }
        }
        return n;
    }

    public static void main(String[] args) {
        int[] vanzari = {300, 1200, 50, 900, 4000};

        System.out.println(numara(vanzari, v -> v > 1000));
        System.out.println(numara(vanzari, v -> v < 100));
    }
}
```

Ieșire

```text
2
1
```

---

Poți face și propria interfață funcțională. Pune `@FunctionalInterface` pe ea, ca Java să verifice că are o singură metodă

```java
@FunctionalInterface
interface Taxa {
    int pe(int suma);
}

public class Main {
    public static void main(String[] args) {
        Taxa normala = s -> s / 10;
        Taxa prieten = s -> 0;

        System.out.println(normala.pe(5000));
        System.out.println(prieten.pe(5000));
    }
}
```

Ieșire

```text
500
0
```

Fiecare lambda scris până acum era unul dintre acestea. `removeIf` primește un Predicate, `forEach` primește un Consumer, `sort` primește un Comparator

---

## Misiune: Ziua Reducerilor

E zi de reduceri la Sunshine Autos. Fiecare mașină peste o limită de preț primește o reducere. Mașinile mai ieftine își păstrează prețul

Prețurile sunt într-un array `int[] preturi`, limita e în `int limita`, iar reducerea în `int procent`. Fă un `Predicate<Integer>` care spune dacă un preț e peste limită și o `Function<Integer, Integer>` care dă noul preț: prețul minus `pret * procent / 100`. Pentru fiecare preț, afișează `pret -> pret nou` când primește reducerea, sau `pret rămâne` când nu o primește. La final afișează `Total: ` și suma tuturor prețurilor după reduceri

**Exemplu**

```text
20000 rămâne
100000 -> 80000
50000 rămâne
60000 -> 48000
Total: 198000
```

**Exemplu**

```text
999 -> 990
Total: 990
```
