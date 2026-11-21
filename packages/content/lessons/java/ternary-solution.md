```java
public class Main {
    public static void main(String[] args) {
        int stars = 3;

        String word = stars == 1 ? "star" : "stars";
        String police = stars > 0 ? "chasing" : "calm";
        System.out.println("Wanted: " + stars + " " + word);
        System.out.println("Police: " + police);
    }
}
```
