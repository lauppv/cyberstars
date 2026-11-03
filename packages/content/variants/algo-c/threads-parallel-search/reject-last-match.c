#include <pthread.h>
#include <stdio.h>

static int nums[20000], target, found = -1;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    int start, stop;
} Range;

static void *search(void *arg) {
    Range *r = arg;
    for (int i = r->start; i < r->stop; i++) {
        if (nums[i] != target) continue;
        pthread_mutex_lock(&lock);
        if (i > found) found = i;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    scanf("%d", &target);
    Range a = {0, n / 2}, b = {n / 2, n};
    pthread_t t1, t2;
    pthread_create(&t1, NULL, search, &a);
    pthread_create(&t2, NULL, search, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    if (found >= 0) printf("Found at index %d\n", found);
    else printf("Not found\n");
    return 0;
}
