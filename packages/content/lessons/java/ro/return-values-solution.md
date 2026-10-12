```java
public class Main {
    public static int crestere(int factor, int zile) {
        int rezultat = 1;
        for (int i = 0; i < zile; i++) {
            rezultat = rezultat * factor;
        }
        return rezultat;
    }

    public static void main(String[] args) {
        int factor = 2;
        int zile = 3;

        System.out.println(crestere(factor, zile));
    }
}
```
