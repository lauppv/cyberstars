#include <stdio.h>
#include <unistd.h>
#include <pthread.h>

void *repeat(void *arg) {
    for (int i = 0; i < 3; i++) printf("%s\n", (char *)arg);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, repeat, "Ping");
    pthread_create(&t2, NULL, repeat, "Pong");
    usleep(200000);
    printf("Test complete\n");
    return 0;
}
