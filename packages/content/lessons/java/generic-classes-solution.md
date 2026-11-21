```java
class Pair<A, B> {
    A first;
    B second;

    Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    A first() {
        return first;
    }

    B second() {
        return second;
    }

    Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        String name = "Tommy";
        int score = 120;

        Pair<String, Integer> pair = new Pair<>(name, score);
        System.out.println(pair);
        System.out.println(pair.swap());
        System.out.println(pair.first() + " has " + pair.second() + " points");
    }
}
```
