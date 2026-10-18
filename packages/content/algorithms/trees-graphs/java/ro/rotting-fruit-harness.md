```java
import java.util.*; import java.io.*; {{code: minutePanaSeStrica}}

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int randuri = scanner.nextInt();
        int coloane = scanner.nextInt();
        char[][] grila = new char[randuri][coloane];
        for (int r = 0; r < randuri; r++) {
            String linie = scanner.next();
            for (int c = 0; c < coloane; c++) {
                grila[r][c] = linie.charAt(c);
            }
        }
        System.out.println(new Solutie().minutePanaSeStrica(grila));
    }
}
```
