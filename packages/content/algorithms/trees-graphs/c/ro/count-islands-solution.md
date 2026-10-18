```c
#include <stdbool.h>

int numara_insule(void) {
    static int coada[MAX_LATURA * MAX_LATURA][2];
    bool vazut[MAX_LATURA][MAX_LATURA] = {{false}};
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int insule = 0;
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            if (grila[r][c] != '#' || vazut[r][c]) {
                continue;
            }
            insule++;
            int inceput = 0;
            int sfarsit = 0;
            vazut[r][c] = true;
            coada[sfarsit][0] = r;
            coada[sfarsit][1] = c;
            sfarsit++;
            while (inceput < sfarsit) {
                int cr = coada[inceput][0];
                int cc = coada[inceput][1];
                inceput++;
                for (int k = 0; k < 4; k++) {
                    int nr = cr + dr[k];
                    int nc = cc + dc[k];
                    if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                            && grila[nr][nc] == '#' && !vazut[nr][nc]) {
                        vazut[nr][nc] = true;
                        coada[sfarsit][0] = nr;
                        coada[sfarsit][1] = nc;
                        sfarsit++;
                    }
                }
            }
        }
    }
    return insule;
}
```
