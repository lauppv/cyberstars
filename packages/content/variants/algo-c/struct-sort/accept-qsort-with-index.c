#include <stdio.h>
#include <stdlib.h>

struct student {
    char name[32];
    int grade;
    int order;
};

static int by_grade(const void *x, const void *y) {
    const struct student *a = x, *b = y;
    if (a->grade != b->grade) return a->grade - b->grade;
    return a->order - b->order;
}

int main(void) {
    int n;
    scanf("%d", &n);
    struct student *s = malloc(sizeof *s * n);
    for (int i = 0; i < n; i++) {
        scanf("%31s %d", s[i].name, &s[i].grade);
        s[i].order = i;
    }
    qsort(s, n, sizeof *s, by_grade);
    for (int i = 0; i < n; i++) printf("%s %d\n", s[i].name, s[i].grade);
    free(s);
    return 0;
}
