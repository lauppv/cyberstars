#include <stdio.h>

static int add_all(const int *a, int len) {
    int s = 0;
    for (int j = len - 1; j >= 0; j--) s += a[j];
    return s;
}

int main(void) {
    int how_many;
    scanf("%d", &how_many);
    int data[how_many];
    int idx = 0;
    while (idx < how_many) {
        scanf("%d", data + idx);
        idx++;
    }
    for (int j = 0; j < how_many; j++) printf("%d\n", data[j]);
    int s = add_all(data, how_many);
    printf("%d\n%f\n", s, s / (double) how_many);
    return 0;
}
