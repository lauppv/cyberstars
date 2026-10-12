#include <stdio.h>
#include <pthread.h>

static void *teleprinter(void *arg) {
    const char *word = arg;
    int left = 3;
    while (left-- > 0) puts(word);
    return NULL;
}

int main(void) {
    const char *signals[2] = {"Ping", "Pong"};
    pthread_t lines[2];
    for (int k = 0; k < 2; k++) pthread_create(&lines[k], NULL, teleprinter, (void *)signals[k]);
    for (int k = 0; k < 2; k++) pthread_join(lines[k], NULL);
    puts("Test complete");
    return 0;
}
