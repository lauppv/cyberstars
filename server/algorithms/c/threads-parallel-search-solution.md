```c
#include <stdio.h>
#include <pthread.h>

int nums[100];
int target;
int found_index = -1;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

typedef struct {
    int start;
    int stop;
} Range;

void *search(void *arg) {
    Range *r = (Range *)arg;
    for (int i = r->start; i < r->stop; i++) {
        if (nums[i] == target) {
            // Update found_index only if the new index is smaller (or the first one).
            pthread_mutex_lock(&lock);
            if (found_index == -1 || i < found_index) {
                found_index = i;
            }
            pthread_mutex_unlock(&lock);
        }
    }
    return NULL;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    scanf("%d", &target);

    int mid = n / 2;
    Range a = { 0, mid };
    Range b = { mid, n };

    pthread_t t1, t2;
    pthread_create(&t1, NULL, search, &a);
    pthread_create(&t2, NULL, search, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    if (found_index >= 0) {
        printf("Found at index %d\n", found_index);
    } else {
        printf("Not found\n");
    }
    return 0;
}
```
