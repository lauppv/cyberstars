#include <stdio.h>

int main(void) {
    int holes;
    int cards = 1;
    int total = 0;
    scanf("%d", &holes);
    total = total + holes;
    while (holes != 0) {
        scanf("%d", &holes);
        cards++;
        total = total + holes;
    }
    printf("Cards: %d\n", cards);
    printf("Holes: %d\n", total);
    return 0;
}
