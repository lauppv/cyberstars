```c
#include <stdio.h>
#include <pthread.h>

typedef struct {
    int *nums;
    int start;
    int stop;
    int local_min;
} Range;

void *find_min(void *arg) {
    // Casting from void * to the concrete type is the pthread convention.
    Range *r = (Range *)arg;
    int m = r->nums[r->start];
    for (int i = r->start + 1; i < r->stop; i++) {
        if (r->nums[i] < m) {
            m = r->nums[i];
        }
    }
    // Write the result into the struct we were passed; main reads it after join.
    r->local_min = m;
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int nums[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }

    int mid = n / 2;
    Range a = { nums, 0, mid, 0 };
    Range b = { nums, mid, n, 0 };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, find_min, &a);
    pthread_create(&t2, NULL, find_min, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    int minimum = a.local_min < b.local_min ? a.local_min : b.local_min;
    printf("Min: %d\n", minimum);
    return 0;
}
```
