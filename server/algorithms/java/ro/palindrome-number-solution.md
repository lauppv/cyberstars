```java
import java.util.Scanner;

public class Main {
    static boolean estePalindrom(int numar) {
        if (numar < 0) {
            return false;
        }

        int original = numar;
        int inversat = 0;
        while (numar > 0) {
            int cifra = numar % 10;
            inversat = inversat * 10 + cifra;
            numar = numar / 10;
        }

        return original == inversat;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int numar = Integer.parseInt(sc.nextLine().trim());
        System.out.println(estePalindrom(numar));
    }
}
```
