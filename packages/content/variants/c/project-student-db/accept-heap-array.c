#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[64];
    int grade;
} Student;

Student *create_student(const char *name, int grade) {
    Student *s = malloc(sizeof *s);
    snprintf(s->name, sizeof s->name, "%s", name);
    s->grade = grade;
    return s;
}

void print_all(Student **list, int count) {
    for (Student **p = list; p < list + count; p++) printf("%s: %d\n", (*p)->name, (*p)->grade);
}

Student *find_top(Student **list, int count) {
    int best = 0;
    for (int k = 1; k < count; k++)
        if (list[k]->grade > list[best]->grade) best = k;
    return list[best];
}

int main(void) {
    int count;
    scanf("%d", &count);
    Student **registry = malloc(count * sizeof *registry);
    for (int k = 0; k < count; k++) {
        char who[64];
        int mark;
        scanf("%63s %d", who, &mark);
        registry[k] = create_student(who, mark);
    }
    print_all(registry, count);
    Student *best = find_top(registry, count);
    printf("Top student: %s (%d)\n", best->name, best->grade);
    for (int k = 0; k < count; k++) free(registry[k]);
    free(registry);
    return 0;
}
