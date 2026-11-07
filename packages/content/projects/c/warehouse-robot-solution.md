```c
#include <stdio.h>
#include <string.h>

#define MAXR 30
#define MAXC 60

char map[MAXR][MAXC + 2];
int rows, cols;
int dist[MAXR][MAXC], parent[MAXR][MAXC];
int qr[MAXR * MAXC], qc[MAXR * MAXC];
int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
char route[MAXR][MAXC + 2];

void bfs(int sr, int sc) {
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) dist[r][c] = -1;
    int head = 0, tail = 0;
    dist[sr][sc] = 0;
    parent[sr][sc] = -1;
    qr[tail] = sr;
    qc[tail++] = sc;
    while (head < tail) {
        int r = qr[head], c = qc[head++];
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (map[nr][nc] == '#' || dist[nr][nc] >= 0) continue;
            dist[nr][nc] = dist[r][c] + 1;
            parent[nr][nc] = r * cols + c;
            qr[tail] = nr;
            qc[tail++] = nc;
        }
    }
}

int find(char ch, int *r, int *c) {
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            if (map[i][j] == ch) {
                *r = i;
                *c = j;
                return 1;
            }
    return 0;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int i = 0; i < rows; i++) scanf("%60s", map[i]);
    char word[16];
    scanf("%15s", word); /* pick: */
    char order[32];
    int n = 0;
    while (n < 26 && scanf("%15s", word) == 1) order[n++] = word[0];

    int letters = 0;
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            if (map[i][j] >= 'A' && map[i][j] <= 'Z' && map[i][j] != 'R') letters++;
    printf("Warehouse %dx%d, %d stations, %d to pick\n", rows, cols, letters, n);

    memcpy(route, map, sizeof map);
    int r, c;
    find('R', &r, &c);
    int total = 0;
    char from = 'R';
    for (int i = 0; i <= n; i++) {
        char to = i < n ? order[i] : 'R';
        int tr, tc;
        if (!find(to, &tr, &tc)) {
            printf("%c -> %c: no station %c\n", from, to, to);
            return 0;
        }
        bfs(r, c);
        if (dist[tr][tc] < 0) {
            printf("%c -> %c: can't get there\n", from, to);
            return 0;
        }
        printf("%c -> %c: %d steps\n", from, to, dist[tr][tc]);
        total += dist[tr][tc];
        for (int p = parent[tr][tc]; p >= 0 && parent[p / cols][p % cols] >= 0; p = parent[p / cols][p % cols])
            if (route[p / cols][p % cols] == '.') route[p / cols][p % cols] = '*';
        r = tr;
        c = tc;
        from = to;
    }
    printf("Total: %d steps\n\n", total);
    for (int i = 0; i < rows; i++) printf("%s\n", route[i]);
    return 0;
}
```
