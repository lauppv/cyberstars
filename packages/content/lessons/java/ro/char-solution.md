```java
public class Main {
    public static void main(String[] args) {
        String numar = "VC 4-28";

        int litere = 0;
        int cifre = 0;
        int altele = 0;
        int suma = 0;
        for (int i = 0; i < numar.length(); i++) {
            char c = numar.charAt(i);
            if (Character.isLetter(c)) {
                litere++;
            } else if (Character.isDigit(c)) {
                cifre++;
                suma = suma + (c - '0');
            } else {
                altele++;
            }
        }
        System.out.println("Litere: " + litere);
        System.out.println("Cifre: " + cifre);
        System.out.println("Altele: " + altele);
        System.out.println("Suma cifrelor: " + suma);
    }
}
```
