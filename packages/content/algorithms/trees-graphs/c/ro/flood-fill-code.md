#include <stdio.h>

#define MAX_LATURA 25

int randuri, coloane;
// grila[r][c] e celula de pe randul r, coloana c.
char grila[MAX_LATURA][MAX_LATURA + 1];

void umple_zona(int r, int c, char culoare) {
    // Scrie codul tau aici
}

int main(void) {
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        scanf("%s", grila[r]);
    }
    int r, c;
    char culoare;
    scanf("%d %d %c", &r, &c, &culoare);
    umple_zona(r, c, culoare);
    for (int i = 0; i < randuri; i++) {
        printf("%s\n", grila[i]);
    }
    return 0;
}
