```java
import java.util.Scanner;

class Pair<A, B> {
    private final A first;
    private final B second;

    Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    A getFirst() {
        return first;
    }

    B getSecond() {
        return second;
    }

    Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine().trim();
        int num = Integer.parseInt(sc.nextLine().trim());
        Pair<String, Integer> pair = new Pair<>(str, num);
        Pair<Integer, String> swapped = pair.swap();
        System.out.println(pair);
        System.out.println(swapped);
    }
}
```
