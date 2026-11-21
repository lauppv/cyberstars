Making a new Thread for every small job gets messy, and a thread is not cheap to create. Real programs use a **thread pool**: a few threads that stay alive and take jobs from a queue, one after another. In Java, a pool is an **ExecutorService**

---

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        pool.submit(() -> System.out.println("Job done"));
        pool.shutdown();
    }
}
```

Output

```text
Job done
```

- `Executors.newFixedThreadPool(2)` makes a pool of 2 threads
- `submit` hands a job to the pool. A free thread picks it up
- `shutdown` says "no more jobs". The pool finishes what it has, then its threads stop. Forget it, and the program never ends, because the pool's threads keep waiting for work

---

The best part: a job can give back a result. A job that returns a value is a **Callable**, and `submit` gives you a **Future**, a ticket for a result that will be ready later. `get()` waits until it is ready and gives it to you

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

Output

```text
57
```

No `join`, no fields to read: the Future carries the result. `get()` can throw checked exceptions (the job may have failed, or the wait may be interrupted), so `main` says `throws Exception`

---

With many jobs, keep the Futures in a list in the order you submitted them. Then read them in that same order, and your output is always in a fixed order, whichever thread finished first

```java
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
    public static void main(String[] args) throws Exception {
        int[] numbers = { 2, 3, 4 };
        ExecutorService pool = Executors.newFixedThreadPool(3);
        ArrayList<Future<Integer>> results = new ArrayList<>();
        for (int n : numbers) {
            results.add(pool.submit(() -> n * n * n));
        }
        for (Future<Integer> f : results) {
            System.out.println(f.get());
        }
        pool.shutdown();
    }
}
```

Output

```text
8
27
64
```

A pool of 3 threads can still take 100 jobs: the jobs wait in the queue until a thread is free

---

## Mission: Price Check

Tommy wants to know which shop sells his shopping list cheapest. Each shop has a price for every item on the list. Store the prices in an `int[][]` named `shops`: one row per shop, one price per item.

Make a pool of 3 threads. Submit one job per shop that adds up that shop's prices and gives the total back. Keep the Futures in a list, then print `Shop N: total` for every shop, with shops counted from 1, and `Cheapest: shop N`. If two shops have the same total, the first one wins. Shut the pool down at the end.

**Example** for `shops = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } }`

```text
Shop 1: 35
Shop 2: 37
Shop 3: 36
Cheapest: shop 1
```

**Example** for `shops = { { 7, 7 }, { 3, 2 } }`

```text
Shop 1: 14
Shop 2: 5
Cheapest: shop 2
```
