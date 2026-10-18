```java
import java.util.ArrayDeque;

class Solutie {
    // grila[r][c] e celula de pe randul r, coloana c.
    static int numaraInsule(char[][] grila) {
        int randuri = grila.length;
        int coloane = grila[0].length;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        boolean[][] vazut = new boolean[randuri][coloane];
        int insule = 0;
        for (int r = 0; r < randuri; r++) {
            for (int c = 0; c < coloane; c++) {
                if (grila[r][c] != '#' || vazut[r][c]) {
                    continue;
                }
                insule++;
                vazut[r][c] = true;
                ArrayDeque<int[]> coada = new ArrayDeque<>();
                coada.add(new int[] {r, c});
                while (!coada.isEmpty()) {
                    int[] celula = coada.remove();
                    for (int k = 0; k < 4; k++) {
                        int nr = celula[0] + dr[k];
                        int nc = celula[1] + dc[k];
                        if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                                && grila[nr][nc] == '#' && !vazut[nr][nc]) {
                            vazut[nr][nc] = true;
                            coada.add(new int[] {nr, nc});
                        }
                    }
                }
            }
        }
        return insule;
    }
}
```
