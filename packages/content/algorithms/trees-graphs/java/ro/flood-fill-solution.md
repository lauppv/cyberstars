```java
import java.util.ArrayDeque;

class Solutie {
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
}
```
