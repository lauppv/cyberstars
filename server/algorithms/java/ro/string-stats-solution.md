```java
import java.util.Scanner;

class AnalizatorText {
    private final String text;

    AnalizatorText(String text) {
        this.text = text;
    }

    private boolean esteVocala(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }

    private boolean esteLitera(char c) {
        return c >= 'a' && c <= 'z';
    }

    int numarVocale() {
        String jos = text.toLowerCase();
        int numar = 0;
        for (int i = 0; i < jos.length(); i++) {
            if (esteVocala(jos.charAt(i))) {
                numar = numar + 1;
            }
        }
        return numar;
    }

    int numarConsoane() {
        String jos = text.toLowerCase();
        int numar = 0;
        for (int i = 0; i < jos.length(); i++) {
            char c = jos.charAt(i);
            if (esteLitera(c) && !esteVocala(c)) {
                numar = numar + 1;
            }
        }
        return numar;
    }

    int numarCuvinte() {
        // Un cuvant incepe cand trecem de la spatiu la o litera.
        // Folosim pattern-ul flag ca sa numaram tranzitiile.
        int numar = 0;
        boolean inCuvant = false;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c != ' ') {
                if (!inCuvant) {
                    numar = numar + 1;
                    inCuvant = true;
                }
            } else {
                inCuvant = false;
            }
        }
        return numar;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String linie = sc.nextLine();
        AnalizatorText analizator = new AnalizatorText(linie);

        System.out.println("Vocale: " + analizator.numarVocale());
        System.out.println("Consoane: " + analizator.numarConsoane());
        System.out.println("Cuvinte: " + analizator.numarCuvinte());
    }
}
```
