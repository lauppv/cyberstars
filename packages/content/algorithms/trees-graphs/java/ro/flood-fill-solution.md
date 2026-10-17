```java
import java.util.ArrayDeque;
import java.util.Scanner;

public class Main {
    // grila[r][c] e celula de pe randul r, coloana c.
    static void umpleZona(char[][] grila, int r, int c, char culoare) {
        char veche = grila[r][c];
        if (veche == culoare) {
            return;
        }
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        grila[r][c] = culoare;
        ArrayDeque<int[]> stiva = new ArrayDeque<>();
        stiva.push(new int[] {r, c});
        while (!stiva.isEmpty()) {
            int[] celula = stiva.pop();
            for (int k = 0; k < 4; k++) {
                int nr = celula[0] + dr[k];
                int nc = celula[1] + dc[k];
                if (nr >= 0 && nr < grila.length && nc >= 0 && nc < grila[0].length
                        && grila[nr][nc] == veche) {
                    grila[nr][nc] = culoare;
                    stiva.push(new int[] {nr, nc});
                }
            }
        }
    }

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
        int r = scanner.nextInt();
        int c = scanner.nextInt();
        char culoare = scanner.next().charAt(0);
        umpleZona(grila, r, c, culoare);
        for (char[] rand : grila) {
            System.out.println(new String(rand));
        }
    }
}
```
