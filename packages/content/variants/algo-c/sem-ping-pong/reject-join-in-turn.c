#include <pthread.h>
#include <stdio.h>

static int rounds;

static void *say(void *arg) {
    printf("%s\n", (const char *)arg);
    return NULL;
}

int main(void) {
    scanf("%d", &rounds);
    for (int i = 0; i < rounds; i++) {
        pthread_t a, b;
        pthread_create(&a, NULL, say, "Ping");
        pthread_join(a, NULL);
        pthread_create(&b, NULL, say, "Pong");
        pthread_join(b, NULL);
    }
    return 0;
}
