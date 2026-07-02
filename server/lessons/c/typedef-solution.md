```c
#include <stdio.h>

typedef struct {
    char name[50];
    int grade;
    double rating;
} Operator;

int main(void) {
    int n;
    scanf("%d", &n);

    Operator operators[100];
    for (int i = 0; i < n; i++) {
        scanf("%s %d %lf", operators[i].name, &operators[i].grade, &operators[i].rating);
    }

    for (int i = 0; i < n; i++) {
        printf("%s - Grade %d - Rating %.2f\n", operators[i].name, operators[i].grade, operators[i].rating);
    }

    return 0;
}
```
