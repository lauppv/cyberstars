So far your programs did one thing at a time, line after line. A **thread** is a separate line of work inside the same program. With two threads, two pieces of code run at the same time, for example on two cores of the processor

---

The simplest way to make a thread: write a class that extends `Thread` and put its work in a method called `run`. Then create it and call **start**

```java
class Worker extends Thread {
    @Override
    public void run() {
        System.out.println("Worker: counting the cash");
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Worker worker = new Worker();
        worker.start();
        worker.join();
        System.out.println("Main: the worker is done");
    }
}
```

Output

```text
Worker: counting the cash
Main: the worker is done
```

- `start()` starts the new thread, and that thread calls `run()`. Main doesn't wait, it goes on with its next line right away
- `join()` makes main wait until the thread has finished
- `join` can be interrupted, so it may throw an `InterruptedException`. That is a checked exception, so `main` says `throws InterruptedException`

---

A common mistake is calling `run()` yourself instead of `start()`. That works, but no new thread is made: main runs the code itself, and nothing happens at the same time. Always call `start()`

---

Without `join`, nobody knows which thread prints first. Run this a few times and the order can change

```java
class Shout extends Thread {
    String word;

    Shout(String word) {
        this.word = word;
    }

    @Override
    public void run() {
        System.out.println(word);
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Shout a = new Shout("Tommy");
        Shout b = new Shout("Lance");
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("Both done");
    }
}
```

`Tommy` and `Lance` can come in either order, because the two threads really run at the same time. Only `Both done` is sure to come last, after both joins

---

So how do you get a result out of a thread in a fixed order? Let each thread keep its result in its own field. After the joins, main reads the fields in the order it wants

```java
class Square extends Thread {
    int number;
    int result;

    Square(int number) {
        this.number = number;
    }

    @Override
    public void run() {
        result = number * number;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Square a = new Square(3);
        Square b = new Square(4);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(a.result + b.result);
    }
}
```

Output

```text
25
```

Reading `a.result` is only safe after `a.join()`. Before that, the thread may still be working

`Thread.sleep(500)` pauses the current thread for 500 milliseconds. Like `join`, it can throw an `InterruptedException`

---

## Mission: Counting the Cash

After a job, the crew brings back bags of cash. Counting them all takes too long, so two people count at the same time: one counts the first half of the bags, the other the second half.

Store the amounts in an `int` array named `bags`. Write a class `Counter` that extends `Thread`. It gets the array and the range of bags it should count, from position `from` up to, but not including, `to`, and keeps its sum in a field.

In `main`, make two counters: the first counts from 0 to `bags.length / 2`, the second from there to the end. Start both, wait for both, then print:

```text
First half: N
Second half: N
Total: N
```

**Example** for `bags = { 100, 250, 75, 300, 5 }`

```text
First half: 350
Second half: 380
Total: 730
```

**Example** for `bags = { 40 }`

```text
First half: 0
Second half: 40
Total: 40
```
