#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char name[16]; int jobs; } Op;

static int cmp(const void *pa, const void *pb) {
    const Op *a = pa, *b = pb;
    int d = (b->jobs > a->jobs) - (b->jobs < a->jobs);
    return d ? d : strcmp(a->name, b->name);
}

int main(void) {
    int n;
    Op list[100];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) scanf("%15s%d", list[i].name, &list[i].jobs);
    qsort(list, (size_t)n, sizeof list[0], cmp);
    for (int i = 0; i < n; i++) printf("%d. %s %d\n", i + 1, list[i].name, list[i].jobs);
    return 0;
}
