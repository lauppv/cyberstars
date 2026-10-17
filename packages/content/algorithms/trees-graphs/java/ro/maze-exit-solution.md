```java
import java.util.ArrayDeque;
import java.util.Scanner;

public class Main {
    // grila[r][c] e celula de pe randul r, coloana c.
    static int ceiMaiPutiniPasi(char[][] grila) {
        int randuri = grila.length;
        int coloane = grila[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int[][] dist = new int[randuri][coloane];
        ArrayDeque<int[]> coada = new ArrayDeque<>();
        for (int r = 0; r < randuri; r++) {
            for (int c = 0; c < coloane; c++) {
                dist[r][c] = -1;
                if (grila[r][c] == 'A') {
                    dist[r][c] = 0;
                    coada.add(new int[] {r, c});
                }
            }
        }
        while (!coada.isEmpty()) {
            int[] celula = coada.remove();
            if (grila[celula[0]][celula[1]] == 'B') {
                return dist[celula[0]][celula[1]];
            }
            for (int k = 0; k < 4; k++) {
                int nr = celula[0] + dr[k];
                int nc = celula[1] + dc[k];
                if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                        && grila[nr][nc] != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[celula[0]][celula[1]] + 1;
                    coada.add(new int[] {nr, nc});
                }
            }
        }
        return -1;
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
        System.out.println(ceiMaiPutiniPasi(grila));
    }
}
```
