#include <pthread.h>
#include <stdio.h>

typedef struct {
    int *nums;
    int start, stop, local_min;
} Range;

static void *find_min(void *arg) {
    Range *r = arg;
    int m = r->nums[r->start];
    for (int i = r->start + 1; i < r->stop; i++) if (r->nums[i] < m) m = r->nums[i];
    r->local_min = m;
    return NULL;
}

int main(void) {
    int n;
    static int nums[20000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    Range a = {nums, 0, n / 2, 0};
    pthread_t t1;
    pthread_create(&t1, NULL, find_min, &a);
    pthread_join(t1, NULL);
    printf("Min: %d\n", a.local_min);
    return 0;
}
