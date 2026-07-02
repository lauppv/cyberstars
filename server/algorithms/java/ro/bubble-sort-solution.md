```java
import java.util.Scanner;

public class Main {
    static void sorteazaBule(int[] tablou) {
        int n = tablou.length;
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
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parti = sc.nextLine().trim().split("\\s+");
        int[] tablou = new int[n];
        for (int i = 0; i < n; i++) {
            tablou[i] = Integer.parseInt(parti[i]);
        }
        sorteazaBule(tablou);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) {
                sb.append(" ");
            }
            sb.append(tablou[i]);
        }
        System.out.println(sb);
    }
}
```
