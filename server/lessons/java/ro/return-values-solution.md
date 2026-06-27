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
        System.out.println(crestere(2, 3));
        System.out.println(crestere(5, 2));
        System.out.println(crestere(7, 0));
    }
}
```
