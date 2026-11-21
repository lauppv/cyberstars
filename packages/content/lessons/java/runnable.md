Extending `Thread` works, but it mixes two things: the work, and the thread that does it. Java has a cleaner way. Write the work as a **Runnable**, an interface with one method, `run()`, and hand it to a `Thread`

---

```java
class Lookout implements Runnable {
    @Override
    public void run() {
        System.out.println("Watching the street");
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(new Lookout());
        t.start();
        t.join();
        System.out.println("Shift over");
    }
}
```

Output

```text
Watching the street
Shift over
```

Your class only says what to do. The Thread does the running. Because `Lookout` doesn't extend Thread, it is still free to extend another class of yours

---

Runnable has a single method, so it is a functional interface. That means you can write it as a lambda, right where you make the thread

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("Watching the street"));
        t.start();
        t.join();
        System.out.println("Shift over");
    }
}
```

Output

```text
Watching the street
Shift over
```

This is how most Java code starts threads today

---

To run many threads, keep them in an array. Start them all first, then join them all. If you joined each one right after starting it, they would run one after another, not at the same time

A lambda can only use local variables that never change, and the loop's `i` changes. So copy it into a new variable inside the loop

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        int[] numbers = { 3, 5, 7 };
        int[] squares = new int[numbers.length];
        Thread[] workers = new Thread[numbers.length];
        for (int i = 0; i < numbers.length; i++) {
            int index = i;
            workers[i] = new Thread(() -> squares[index] = numbers[index] * numbers[index]);
            workers[i].start();
        }
        for (Thread w : workers) {
            w.join();
        }
        for (int s : squares) {
            System.out.println(s);
        }
    }
}
```

Output

```text
9
25
49
```

Each thread writes into its own place in `squares`, so they never get in each other's way. Main reads the array only after all the joins

---

## Mission: Radio Codes

Tommy's lookouts send code words over the radio. The more vowels in a word, the more urgent it is. Store the words in a `String` array named `words`.

Start one thread per word, each one made from a lambda, that counts the vowels in its word (`a`, `e`, `i`, `o`, `u`, small or capital) and keeps the count in its own place of an `int` array. Start all the threads, then join all of them. Don't extend `Thread`.

Then print `<word>: N vowels` for each word, in order, and `Most urgent: <word>`, the word with the most vowels. If two words tie, the first one wins. There is always at least one word.

**Example** for `words = { "Malibu", "dock", "Ocean" }`

```text
Malibu: 3 vowels
dock: 1 vowels
Ocean: 3 vowels
Most urgent: Malibu
```

**Example** for `words = { "xyz" }`

```text
xyz: 0 vowels
Most urgent: xyz
```
