Threads that only touch their own data are easy. Trouble starts when two threads change the **same** data at the same time. The result depends on who gets there first, and that is called a **race condition**

---

Two threads each add 1 to a shared counter, 10000 times. You would expect 20000

```java
class Counter {
    int value = 0;

    void add() {
        value++;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Runnable job = () -> {
            for (int i = 0; i < 10000; i++) {
                counter.add();
            }
        };
        Thread a = new Thread(job);
        Thread b = new Thread(job);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(counter.value);
    }
}
```

Run it a few times. Often you get less than 20000, and a different number each time

Why? `value++` looks like one step, but it is three: read the value, add 1, write it back. If both threads read 41 at the same moment, both write 42, and one of the additions is lost

---

The fix is to let only one thread at a time into the method. Mark it **synchronized**

```java
class Counter {
    int value = 0;

    synchronized void add() {
        value++;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();
        Runnable job = () -> {
            for (int i = 0; i < 10000; i++) {
                counter.add();
            }
        };
        Thread a = new Thread(job);
        Thread b = new Thread(job);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(counter.value);
    }
}
```

Output

```text
20000
```

Every object has a lock. A thread that calls a synchronized method takes the object's lock first. If another thread holds it, the new one waits at the door until the lock is free. So the three steps of `value++` can't get mixed any more

---

You can also lock just a few lines, with a **synchronized block**. You name the object whose lock to take

```java
public class Main {
    static int total = 0;
    static final Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable job = () -> {
            for (int i = 0; i < 5000; i++) {
                synchronized (LOCK) {
                    total += 2;
                }
            }
        };
        Thread a = new Thread(job);
        Thread b = new Thread(job);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(total);
    }
}
```

Output

```text
20000
```

Keep the locked part small. While one thread holds the lock, the others wait, so a big locked part makes threads take turns instead of working at the same time

---

## Mission: The Bank Vault

Several bank tellers put money into the same vault at the same time. Write a class `Vault` with a `deposit(int amount)` method that adds the amount to the balance and counts the deposit. Make it safe with `synchronized`.

In `main`, store the number of tellers in an `int` named `tellers`, how many deposits each teller makes in an `int` named `deposits`, and the amount of each deposit in an `int` named `amount`. Start one thread per teller, each making its deposits into the same vault. Wait for all of them, then print:

```text
Deposits made: N
Balance: N
```

**Example** for `tellers = 4`, `deposits = 1000` and `amount = 10`

```text
Deposits made: 4000
Balance: 40000
```

**Example** for `tellers = 1`, `deposits = 3` and `amount = 50`

```text
Deposits made: 3
Balance: 150
```
