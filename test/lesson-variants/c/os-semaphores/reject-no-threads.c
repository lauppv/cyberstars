#include <stdio.h>
#include <semaphore.h>

int main(void) {
    sem_t printers;
    sem_init(&printers, 0, 2);
    for (int i = 1; i <= 4; i++) {
        sem_wait(&printers);
        printf("Thread %d printing\n", i);
        printf("Thread %d done\n", i);
        sem_post(&printers);
    }
    printf("All jobs finished\n");
    sem_destroy(&printers);
    return 0;
}
