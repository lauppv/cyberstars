#include <stdio.h>

typedef char Name[50];

int main(void) {
    int n;
    scanf("%d", &n);
    Name names[100];
    int grades[100];
    double ratings[100];
    for (int i = 0; i < n; i++) scanf("%s %d %lf", names[i], &grades[i], &ratings[i]);
    for (int i = 0; i < n; i++) printf("%s - Grade %d - Rating %.2f\n", names[i], grades[i], ratings[i]);
    return 0;
}
