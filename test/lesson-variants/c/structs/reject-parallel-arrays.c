#include <stdio.h>

int main(void) {
    char labels[2][50];
    int years[2], meters[2];
    for (int i = 0; i < 2; i++) scanf("%s %d %d", labels[i], &years[i], &meters[i]);
    for (int i = 0; i < 2; i++) printf("%s (%d) - %d m\n", labels[i], years[i], meters[i]);
    return 0;
}
