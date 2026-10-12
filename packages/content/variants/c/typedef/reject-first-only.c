#include <stdio.h>

typedef struct { char name[50]; int grade; double rating; } Operator;

int main(void) {
    int n;
    scanf("%d", &n);
    Operator op;
    for (int i = 0; i < 1; i++) {
        scanf("%s %d %lf", op.name, &op.grade, &op.rating);
        printf("%s - Grade %d - Rating %.2f\n", op.name, op.grade, op.rating);
    }
    return 0;
}
