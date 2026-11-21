#include <stdio.h>

int main(void) {
    int reels, temp;
    scanf("%d %d", &reels, &temp);
    if (reels == 1) printf("1 reel loaded\n");
    else printf("%d reels loaded\n", reels);
    printf("Room: %s\n", temp > 30 ? "hot" : "OK");
    return 0;
}
