#include <stdio.h>

int main(void) {
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    for (int i = 0; i < 3; i++) {
        for (int j = i + 1; j < 3; j++) {
            int t = m[i][j];
            m[i][j] = m[j][i];
            m[j][i] = t;
        }
    }
    for (int i = 0; i < 3; i++) printf("%d %d %d\n", m[i][0], m[i][1], m[i][2]);
    return 0;
}
