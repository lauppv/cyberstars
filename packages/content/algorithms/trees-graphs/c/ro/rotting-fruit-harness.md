```c
#include <stdio.h>

#define MAX_LATURA 25

int randuri, coloane;
// grila[r][c] e celula de pe randul r, coloana c.
char grila[MAX_LATURA][MAX_LATURA + 1];

#line 1 "main.c"
{{code: minute_pana_se_strica}}

int main(void) {
    scanf("%d %d", &randuri, &coloane);
    for (int r = 0; r < randuri; r++) {
        scanf("%s", grila[r]);
    }
    printf("%d\n", minute_pana_se_strica());
    return 0;
}
```
