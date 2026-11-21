#include <stdio.h>
#include <string.h>

static int N, M, av[4], mx[8][4], al[8][4];

static int can(int i, const int *w) {
    for (int j = 0; j < M; j++) if (mx[i][j] - al[i][j] > w[j]) return 0;
    return 1;
}

static int check(int *seq) {
    int w[4], done[8] = {0}, k = 0;
    memcpy(w, av, sizeof w);
    while (k < N) {
        int i = 0;
        while (i < N && (done[i] || !can(i, w))) i++;
        if (i == N) return 0;
        done[i] = 1;
        seq[k++] = i;
        for (int j = 0; j < M; j++) w[j] += al[i][j];
    }
    return 1;
}

int main(void) {
    scanf("%d%d", &N, &M);
    for (int j = 0; j < M; j++) scanf("%d", &av[j]);
    for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) scanf("%d", &mx[i][j]);
    for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) scanf("%d", &al[i][j]);
    int seq[8];
    if (!check(seq)) { puts("Unsafe"); return 0; }
    printf("Safe:");
    for (int i = 0; i < N; i++) printf(" P%d", seq[i]);
    puts("");
    int p, r[4];
    while (scanf("%d", &p) == 1) {
        for (int j = 0; j < M; j++) scanf("%d", &r[j]);
        printf("P%d", p);
        int over_need = 0, over_av = 0;
        for (int j = 0; j < M; j++) {
            printf(" %d", r[j]);
            if (r[j] > mx[p][j] - al[p][j]) over_need = 1;
            if (r[j] > av[j]) over_av = 1;
        }
        if (over_need) { puts(": error"); continue; }
        if (over_av) { puts(": wait"); continue; }
        for (int j = 0; j < M; j++) { av[j] -= r[j]; al[p][j] += r[j]; }
        if (check(seq)) { puts(": granted"); continue; }
        for (int j = 0; j < M; j++) { av[j] += r[j]; al[p][j] -= r[j]; }
        puts(": unsafe");
    }
    return 0;
}
