#include <stdio.h>
#include <semaphore.h>

int main(void) {
    sem_t ready;
    sem_init(&ready, 0, 0);
    int sum = 0;
    for (int i = 1; i <= 10; i++) sum += i;
    sem_post(&ready);
    sem_wait(&ready);
    printf("Sum: %d\n", sum);
    sem_destroy(&ready);
    return 0;
}
