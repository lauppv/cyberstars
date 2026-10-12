#include <stdio.h>

int main(void) {
    int sealed, alarm;
    scanf("%d %d", &sealed, &alarm);
    for (int i = 1; i <= 20; i++) {
        if (i == alarm) break;
        if (i != sealed) printf("%d\n", i);
    }
    return 0;
}
