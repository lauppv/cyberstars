```c
#include <stdio.h>
#include <pthread.h>

void *repeta(void *arg) {
    char *semnal = (char *)arg;
    for (int i = 0; i < 3; i++) {
        printf("%s\n", semnal);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, repeta, "Ping");
    pthread_create(&t2, NULL, repeta, "Pong");

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Test complet\n");
    return 0;
}
```
