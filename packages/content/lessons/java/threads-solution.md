```java
class Counter extends Thread {
    int[] bags;
    int from;
    int to;
    int sum;

    Counter(int[] bags, int from, int to) {
        this.bags = bags;
        this.from = from;
        this.to = to;
    }

    @Override
    public void run() {
        for (int i = from; i < to; i++) {
            sum += bags[i];
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        int[] bags = { 100, 250, 75, 300, 5 };

        int middle = bags.length / 2;
        Counter first = new Counter(bags, 0, middle);
        Counter second = new Counter(bags, middle, bags.length);
        first.start();
        second.start();
        first.join();
        second.join();
        System.out.println("First half: " + first.sum);
        System.out.println("Second half: " + second.sum);
        System.out.println("Total: " + (first.sum + second.sum));
    }
}
```
