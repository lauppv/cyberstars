```java
import java.util.Scanner;

public class Main {
    static boolean estePalindrom(int numar) {
        // Numerele negative nu sunt niciodata palindroame din cauza semnului.
        if (numar < 0) {
            return false;
        }

        // Ideea: inversam cifrele intr-un al doilea numar si comparam cu originalul.
        // Extragem ultima cifra (numar % 10), o lipim la finalul lui "inversat",
        // apoi taiem ultima cifra din numar (numar / 10).
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
        int numar = Integer.parseInt(sc.nextLine());
        System.out.println(estePalindrom(numar));
    }
}
```
