```java
public class Main {
    public static int splitLoot(int loot, int crew) {
        return loot / crew;
    }

    public static void main(String[] args) {
        System.out.println("10000 / 4 = " + splitLoot(10000, 4));
        System.out.println("5000 / 3 = " + splitLoot(5000, 3));
        System.out.println("8000 / 1 = " + splitLoot(8000, 1));
    }
}
```
