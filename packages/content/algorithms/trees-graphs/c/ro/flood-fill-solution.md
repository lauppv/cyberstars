```c
void umple_zona(int r, int c, char culoare) {
    static int stiva[MAX_LATURA * MAX_LATURA][2];
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    char veche = grila[r][c];
    if (veche == culoare) {
        return;
    }
    int varf = 0;
    grila[r][c] = culoare;
    stiva[varf][0] = r;
    stiva[varf][1] = c;
    varf++;
    while (varf > 0) {
        varf--;
        int cr = stiva[varf][0];
        int cc = stiva[varf][1];
        for (int k = 0; k < 4; k++) {
            int nr = cr + dr[k];
            int nc = cc + dc[k];
            if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane && grila[nr][nc] == veche) {
                grila[nr][nc] = culoare;
                stiva[varf][0] = nr;
                stiva[varf][1] = nc;
                varf++;
            }
        }
    }
}
```
