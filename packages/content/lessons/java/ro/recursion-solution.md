```java
public class Main {
    static void deschide(int n) {
        if (n == 0) {
            System.out.println("Am gasit banii!");
            return;
        }
        System.out.println("Deschid cutia " + n);
        deschide(n - 1);
        System.out.println("Inchid cutia " + n);
    }

    public static void main(String[] args) {
        int cutii = 3;

        deschide(cutii);
    }
}
```
