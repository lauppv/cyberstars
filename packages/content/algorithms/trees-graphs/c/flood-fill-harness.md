```c
#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

#line 1 "main.c"
{{code: flood_fill}}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    int r, c;
    char color;
    scanf("%d %d %c", &r, &c, &color);
    flood_fill(r, c, color);
    for (int i = 0; i < rows; i++) {
        printf("%s\n", grid[i]);
    }
    return 0;
}
```
