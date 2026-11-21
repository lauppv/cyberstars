#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct operator { char name[16]; int jobs; };

int by_jobs(const void *a, const void *b) {
    const struct operator *x = a, *y = b;
    return (y->jobs > x->jobs) - (y->jobs < x->jobs);
}

int main(void) {
    int n;
    struct operator ops[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%15s %d", ops[i].name, &ops[i].jobs);
    qsort(ops, n, sizeof(struct operator), by_jobs);
    for (int i = 0; i < n; i++) printf("%d. %s %d\n", i + 1, ops[i].name, ops[i].jobs);
    return 0;
}
