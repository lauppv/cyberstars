#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct { const int *data; int len; } Slice;

static void *sum_slice(void *arg) {
    Slice *s = arg;
    long *out = malloc(sizeof *out);
    *out = 0;
    for (int i = 0; i < s->len; i++) *out += s->data[i];
    return out;
}

int main(void) {
    int k, n;
    scanf("%d%d", &k, &n);
    int *v = malloc(sizeof(int) * n);
    for (int i = 0; i < n; i++) scanf("%d", v + i);
    Slice sl[8];
    pthread_t th[8];
    for (int i = 0, at = 0; i < k; i++) {
        sl[i].len = n / k + (i < n % k);
        sl[i].data = v + at;
        at += sl[i].len;
        pthread_create(th + i, NULL, sum_slice, sl + i);
    }
    long total = 0;
    for (int i = 0; i < k; i++) {
        void *r;
        pthread_join(th[i], &r);
        long part = *(long *)r;
        free(r);
        printf("piece %d: %d readings, sum %ld\n", i + 1, sl[i].len, part);
        total += part;
    }
    printf("total: %ld\n", total);
    free(v);
    return 0;
}
