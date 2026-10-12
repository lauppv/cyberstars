#include <stdio.h>

int main(void) {
    int sealed, alarm;
    scanf("%d %d", &sealed, &alarm);
    int stopped = 0;
    for (int i = 1; i <= 20 && !stopped; i++) {
        if (i == sealed) continue;
        if (i == alarm) stopped = 1;
        else printf("%d\n", i);
    }
    return 0;
}
