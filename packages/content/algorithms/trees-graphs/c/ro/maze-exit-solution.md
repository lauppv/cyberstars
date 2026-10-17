```c
#include <stdio.h>

#define MAX_LATURA 25

int randuri, coloane;
// grila[r][c] e celula de pe randul r, coloana c.
char grila[MAX_LATURA][MAX_LATURA + 1];

int cei_mai_putini_pasi(void) {
    static int coada[MAX_LATURA * MAX_LATURA][2];
    int distanta[MAX_LATURA][MAX_LATURA];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int inceput = 0;
    int sfarsit = 0;
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            distanta[r][c] = -1;
            if (grila[r][c] == 'A') {
                distanta[r][c] = 0;
                coada[sfarsit][0] = r;
                coada[sfarsit][1] = c;
                sfarsit++;
            }
        }
    }
    while (inceput < sfarsit) {
        int cr = coada[inceput][0];
        int cc = coada[inceput][1];
        inceput++;
        if (grila[cr][cc] == 'B') {
            return distanta[cr][cc];
        }
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane
                    && grila[nr][nc] != '#' && distanta[nr][nc] == -1) {
                distanta[nr][nc] = distanta[cr][cc] + 1;
                coada[sfarsit][0] = nr;
                coada[sfarsit][1] = nc;
                sfarsit++;
            }
        }
    }
    return -1;
}

int main(void) {
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        scanf("%s", grila[r]);
    }
    printf("%d\n", cei_mai_putini_pasi());
    return 0;
}
```
