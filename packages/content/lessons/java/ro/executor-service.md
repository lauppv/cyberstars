Să faci un Thread nou pentru fiecare treabă mică devine încâlcit, iar un thread nu e ieftin de creat. Programele adevărate folosesc un **thread pool**: câteva thread-uri care rămân în viață și iau treburi dintr-o coadă, una după alta. În Java, un pool e un **ExecutorService**

---

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        pool.submit(() -> System.out.println("Treaba facuta"));
        pool.shutdown();
    }
}
```

Ieșire

```text
Treaba facuta
```

- `Executors.newFixedThreadPool(2)` face un pool de 2 thread-uri
- `submit` dă o treabă pool-ului. Un thread liber o preia
- `shutdown` spune „nu mai vin treburi”. Pool-ul termină ce are, apoi thread-urile lui se opresc. Dacă îl uiți, programul nu se mai termină, fiindcă thread-urile pool-ului așteaptă de lucru la nesfârșit

---

Partea cea mai bună: o treabă poate da înapoi un rezultat. O treabă care întoarce o valoare e un **Callable**, iar `submit` îți dă un **Future**, un bon pentru un rezultat care va fi gata mai târziu. `get()` așteaptă până e gata și ți-l dă

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<Integer> a = pool.submit(() -> 6 * 7);
        Future<Integer> b = pool.submit(() -> 10 + 5);
        System.out.println(a.get() + b.get());
        pool.shutdown();
    }
}
```

Ieșire

```text
57
```

Fără `join`, fără câmpuri de citit: Future-ul poartă rezultatul. `get()` poate arunca excepții checked (treaba poate să fi eșuat sau așteptarea să fie întreruptă), așa că `main` spune `throws Exception`

---

Cu multe treburi, ține Future-urile într-o listă, în ordinea în care le-ai trimis. Apoi citește-le în aceeași ordine, iar ieșirea ta are mereu o ordine fixă, oricare thread ar fi terminat primul

```java
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        int[] numere = { 2, 3, 4 };
        ExecutorService pool = Executors.newFixedThreadPool(3);
        ArrayList<Future<Integer>> rezultate = new ArrayList<>();
        for (int n : numere) {
            rezultate.add(pool.submit(() -> n * n * n));
        }
        for (Future<Integer> f : rezultate) {
            System.out.println(f.get());
        }
        pool.shutdown();
    }
}
```

Ieșire

```text
8
27
64
```

Un pool de 3 thread-uri poate primi totuși 100 de treburi: treburile așteaptă în coadă până se eliberează un thread

---

## Misiune: Compararea prețurilor

Tommy vrea să știe ce magazin îi vinde lista de cumpărături cel mai ieftin. Fiecare magazin are un preț pentru fiecare produs de pe listă. Stochează prețurile într-un `int[][]` numit `magazine`: un rând pentru fiecare magazin, un preț pentru fiecare produs.

Fă un pool de 3 thread-uri. Trimite câte o treabă pentru fiecare magazin care adună prețurile acelui magazin și dă totalul înapoi. Ține Future-urile într-o listă, apoi afișează `Magazinul N: total` pentru fiecare magazin, cu magazinele numărate de la 1, și `Cel mai ieftin: magazinul N`. Dacă două magazine au același total, câștigă primul. La final, oprește pool-ul.

**Exemplu** pentru `magazine = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } }`

```text
Magazinul 1: 35
Magazinul 2: 37
Magazinul 3: 36
Cel mai ieftin: magazinul 1
```

**Exemplu** pentru `magazine = { { 7, 7 }, { 3, 2 } }`

```text
Magazinul 1: 14
Magazinul 2: 5
Cel mai ieftin: magazinul 2
```
