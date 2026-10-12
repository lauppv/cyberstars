#include <stdio.h>

int sum_array(int *base, int len) {
    int s = 0;
    for (int off = len - 1; off >= 0; off--) s += *(base + off);
    return s;
}

int main(void) {
    int len;
    scanf("%d", &len);
    int numbers[len];
    int i = 0;
    while (i < len) scanf("%d", &numbers[i++]);
    int answer = sum_array(numbers, len);
    printf("%d\n", answer);
    return 0;
}
