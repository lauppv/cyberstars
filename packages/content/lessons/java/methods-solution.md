```java
public class Main {
    public static int splitLoot(int loot, int crew) {
        return loot / crew;
    }

    public static void main(String[] args) {
        int loot = 10000;
        int crew = 4;

        System.out.println(loot + " / " + crew + " = " + splitLoot(loot, crew));
    }
}
```
