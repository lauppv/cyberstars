```java
public class Main {
    public static void main(String[] args) {
        int x1 = 0;
        int y1 = 0;
        int x2 = 3;
        int y2 = 4;

        int lateral = Math.abs(x2 - x1);
        int vertical = Math.abs(y2 - y1);
        double dreapta = Math.sqrt(lateral * lateral + vertical * vertical);
        System.out.println("Pe jos: " + (lateral + vertical) + " blocuri");
        System.out.println("In zbor: " + Math.round(dreapta));
        System.out.println("Cea mai lunga bucata: " + Math.max(lateral, vertical));
    }
}
```
