```java
import java.util.ArrayDeque;
import java.util.Scanner;

public class Main {
    // grila[r][c] e celula de pe randul r, coloana c.
    static int minutePanaSeStrica(char[][] grila) {
        int randuri = grila.length;
        int coloane = grila[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int[][] minut = new int[randuri][coloane];
        ArrayDeque<int[]> coada = new ArrayDeque<>();
        int proaspete = 0;
        for (int r = 0; r < randuri; r++) {
            for (int c = 0; c < coloane; c++) {
                minut[r][c] = -1;
                if (grila[r][c] == 'x') {
                    minut[r][c] = 0;
                    coada.add(new int[] {r, c});
                } else if (grila[r][c] == 'o') {
                    proaspete++;
                }
            }
        }
        int ultimul = 0;
        while (!coada.isEmpty()) {
            int[] celula = coada.remove();
            for (int k = 0; k < 4; k++) {
                int nr = celula[0] + dr[k];
                int nc = celula[1] + dc[k];
                if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                        && grila[nr][nc] == 'o' && minut[nr][nc] == -1) {
                    minut[nr][nc] = minut[celula[0]][celula[1]] + 1;
                    ultimul = minut[nr][nc];
                    proaspete--;
                    coada.add(new int[] {nr, nc});
                }
            }
        }
        if (proaspete > 0) {
            return -1;
        }
        return ultimul;
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
        System.out.println(minutePanaSeStrica(grila));
    }
}
```
