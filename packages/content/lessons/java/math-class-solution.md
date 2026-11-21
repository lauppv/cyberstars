```java
public class Main {
    public static void main(String[] args) {
        int x1 = 0;
        int y1 = 0;
        int x2 = 3;
        int y2 = 4;

        int across = Math.abs(x2 - x1);
        int up = Math.abs(y2 - y1);
        double straight = Math.sqrt(across * across + up * up);
        System.out.println("Walk: " + (across + up) + " blocks");
        System.out.println("Fly: " + Math.round(straight));
        System.out.println("Longest leg: " + Math.max(across, up));
    }
}
```
