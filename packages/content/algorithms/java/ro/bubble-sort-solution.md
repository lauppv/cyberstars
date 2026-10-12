```java
import java.util.Scanner;

public class Main {
    static void sorteazaBule(int[] tablou) {
        int n = tablou.length;

        // La fiecare parcurgere, cel mai mare element "urca" la coada.
        // Dupa i parcurgeri, ultimele i pozitii sunt deja sortate.
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (tablou[j] > tablou[j + 1]) {
                    int aux = tablou[j];
                    tablou[j] = tablou[j + 1];
                    tablou[j + 1] = aux;
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        int[] tablou = new int[n];
        for (int i = 0; i < n; i++) {
            tablou[i] = Integer.parseInt(sc.nextLine());
        }

        sorteazaBule(tablou);

        // Construim output-ul manual, separat prin spatii.
        String out = "";
        for (int i = 0; i < n; i++) {
            out = out + tablou[i];
            if (i < n - 1) {
                out = out + " ";
            }
        }
        System.out.println(out);
    }
}
```
