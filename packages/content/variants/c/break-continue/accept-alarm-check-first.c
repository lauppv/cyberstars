#include <stdio.h>

int main(void) {
    int skip_me, stop_at;
    scanf("%d %d", &skip_me, &stop_at);
    for (int reader = 1; reader <= 20; ++reader) {
        if (reader == stop_at) break;
        if (reader == skip_me) continue;
        printf("%d\n", reader);
    }
    return 0;
}
