#include <stdio.h>

int main(void) {
    int lines;
    scanf("%d", &lines);
    for (int row = 0; row < lines; row++) {
        for (int k = 0; k <= row; k++)
            printf(k == 0 ? "%d" : " %d", k + 1);
        printf("\n");
    }
    return 0;
}
