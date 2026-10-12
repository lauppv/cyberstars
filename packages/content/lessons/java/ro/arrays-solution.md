```java
public class Main {
    public static void main(String[] args) {
        int[] incasari = { 1200, 3400, 800, 2600 };

        int total = 0;
        for (int suma : incasari) {
            System.out.println(suma);
            total = total + suma;
        }

        System.out.println(total);

        double media = (double) total / incasari.length;
        System.out.println(media);
    }
}
```
