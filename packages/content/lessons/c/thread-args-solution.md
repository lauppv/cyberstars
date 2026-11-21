```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

struct piece {
    int start;
    int length;
    int *readings;
    long sum;
};

void *add_piece(void *arg) {
    struct piece *p = arg;
    long sum = 0;
    for (int i = p->start; i < p->start + p->length; i++) {
        sum = sum + p->readings[i];
    }
    p->sum = sum;
    return NULL;
}

int main(void) {
    int k, n;
    scanf("%d %d", &k, &n);
    int *readings = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &readings[i]);
    }

    struct piece pieces[8];
    pthread_t threads[8];
    int start = 0;
    for (int i = 0; i < k; i++) {
        pieces[i].start = start;
        pieces[i].length = n / k + (i < n % k ? 1 : 0);
        pieces[i].readings = readings;
        pieces[i].sum = 0;
        start = start + pieces[i].length;
        pthread_create(&threads[i], NULL, add_piece, &pieces[i]);
    }

    long total = 0;
    for (int i = 0; i < k; i++) {
        pthread_join(threads[i], NULL);
        printf("piece %d: %d readings, sum %ld\n", i + 1, pieces[i].length, pieces[i].sum);
        total = total + pieces[i].sum;
    }
    printf("total: %ld\n", total);

    free(readings);
    return 0;
}
```
