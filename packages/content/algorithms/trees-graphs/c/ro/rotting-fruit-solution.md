```c
#include <stdio.h>

#define MAX_LATURA 25

int randuri, coloane;
// grila[r][c] e celula de pe randul r, coloana c.
char grila[MAX_LATURA][MAX_LATURA + 1];

int minute_pana_se_strica(void) {
    static int coada[MAX_LATURA * MAX_LATURA][2];
    int minut[MAX_LATURA][MAX_LATURA];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int inceput = 0;
    int sfarsit = 0;
    int proaspete = 0;
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            minut[r][c] = -1;
            if (grila[r][c] == 'x') {
                minut[r][c] = 0;
                coada[sfarsit][0] = r;
                coada[sfarsit][1] = c;
                sfarsit++;
            } else if (grila[r][c] == 'o') {
                proaspete++;
            }
        }
    }
    int ultimul = 0;
    while (inceput < sfarsit) {
        int cr = coada[inceput][0];
        int cc = coada[inceput][1];
        inceput++;
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                    && grila[nr][nc] == 'o' && minut[nr][nc] == -1) {
                minut[nr][nc] = minut[cr][cc] + 1;
                ultimul = minut[nr][nc];
                proaspete--;
                coada[sfarsit][0] = nr;
                coada[sfarsit][1] = nc;
                sfarsit++;
            }
        }
    }
    if (proaspete > 0) {
        return -1;
    }
    return ultimul;
}

int main(void) {
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        scanf("%s", grila[r]);
    }
    printf("%d\n", minute_pana_se_strica());
    return 0;
}
```
