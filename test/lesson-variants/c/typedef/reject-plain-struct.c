#include <stdio.h>

struct Operator {
    char name[50];
    int grade;
    double rating;
};

int main(void) {
    int n;
    scanf("%d", &n);
    struct Operator ops[100];
    for (int i = 0; i < n; i++) scanf("%s %d %lf", ops[i].name, &ops[i].grade, &ops[i].rating);
    for (int i = 0; i < n; i++) printf("%s - Grade %d - Rating %.2f\n", ops[i].name, ops[i].grade, ops[i].rating);
    return 0;
}
