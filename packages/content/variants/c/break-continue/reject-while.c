#include <stdio.h>

int main(void) {
    int sealed, alarm;
    scanf("%d %d", &sealed, &alarm);
    int i = 0;
    while (i < 20) {
        i++;
        if (i == sealed) continue;
        if (i == alarm) break;
        printf("%d\n", i);
    }
    return 0;
}
