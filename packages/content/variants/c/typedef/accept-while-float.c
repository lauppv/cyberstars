#include <stdio.h>

typedef struct Op {
    char name[50];
    int grade;
    float rating;
} Operator;

static void report(Operator o) {
    printf("%s - Grade %d - Rating %.2f\n", o.name, o.grade, o.rating);
}

int main(void) {
    int n;
    scanf("%d", &n);
    while (n-- > 0) {
        Operator o;
        scanf("%s %d %f", o.name, &o.grade, &o.rating);
        report(o);
    }
    return 0;
}
