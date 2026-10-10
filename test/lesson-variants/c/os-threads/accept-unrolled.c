#include <stdio.h>
#include <pthread.h>

void *say(void *text) {
    printf("%s\n", (char *)text);
    printf("%s\n", (char *)text);
    printf("%s\n", (char *)text);
    return NULL;
}

int main(void) {
    pthread_t ping, pong;
    char a[] = "Ping", b[] = "Pong";
    pthread_create(&ping, NULL, say, a);
    pthread_create(&pong, NULL, say, b);
    pthread_join(ping, NULL);
    pthread_join(pong, NULL);
    printf("Test complete\n");
    return 0;
}
