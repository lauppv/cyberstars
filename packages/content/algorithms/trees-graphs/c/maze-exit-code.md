#include <stdio.h>

#define MAX_SIDE 25

int rows, cols;
// grid[r][c] is the cell in row r, column c.
char grid[MAX_SIDE][MAX_SIDE + 1];

int fewest_steps(void) {
    // Write your code here
    return -1;
}

int main(void) {
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        scanf("%s", grid[r]);
    }
    printf("%d\n", fewest_steps());
    return 0;
}
