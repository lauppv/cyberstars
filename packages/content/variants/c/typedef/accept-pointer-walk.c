#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[64];
    int grade;
    double rating;
} Operator;

int main(void) {
    int count;
    scanf("%d", &count);
    Operator *team = malloc((count > 0 ? count : 1) * sizeof(Operator));
    for (Operator *p = team; p < team + count; p++) scanf("%63s %d %lf", p->name, &p->grade, &p->rating);
    for (Operator *p = team; p < team + count; p++)
        printf("%s - Grade %d - Rating %.2f\n", p->name, p->grade, p->rating);
    free(team);
    return 0;
}
