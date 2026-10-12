```c
#include <stdio.h>
#include <pthread.h>

void *repeat(void *arg) {
    char *signal = (char *)arg;
    for (int i = 0; i < 3; i++) {
        printf("%s\n", signal);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, repeat, "Ping");
    pthread_create(&t2, NULL, repeat, "Pong");

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Test complete\n");
    return 0;
}
```
