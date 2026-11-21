#include <stdio.h>

int main(void) {
    int reels, temp;
    scanf("%d %d", &reels, &temp);
    printf("%d %s loaded\n", reels, reels <= 1 ? "reel" : "reels");
    printf("Room: %s\n", temp > 30 ? "hot" : "OK");
    return 0;
}
