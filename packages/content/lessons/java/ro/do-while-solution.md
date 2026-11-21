```java
public class Main {
    public static void main(String[] args) {
        int kilometraj = 4072;

        int cifre = 0;
        do {
            System.out.println(kilometraj % 10);
            kilometraj = kilometraj / 10;
            cifre++;
        } while (kilometraj > 0);
        System.out.println("Cifre: " + cifre);
    }
}
```
