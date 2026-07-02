```c
#include <stdio.h>

typedef struct {
    char nume[50];
    int grad;
    double evaluare;
} Operator;

int main(void) {
    int n;
    scanf("%d", &n);

    Operator operatori[100];
    for (int i = 0; i < n; i++) {
        scanf("%s %d %lf", operatori[i].nume, &operatori[i].grad, &operatori[i].evaluare);
    }

    for (int i = 0; i < n; i++) {
        printf("%s - Grad %d - Evaluare %.2f\n", operatori[i].nume, operatori[i].grad, operatori[i].evaluare);
    }

    return 0;
}
```
