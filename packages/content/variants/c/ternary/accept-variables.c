#include <stdio.h>

int main(void) {
    int n, t;
    scanf("%d%d", &n, &t);
    const char *word = (n == 1) ? "reel" : "reels";
    const char *room = (t <= 30) ? "OK" : "hot";
    printf("%d %s loaded\nRoom: %s\n", n, word, room);
    return 0;
}
