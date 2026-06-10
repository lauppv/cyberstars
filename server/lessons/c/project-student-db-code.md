#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

Student *create_student(const char *name, int grade) {
    Student *s = malloc(sizeof(Student));
    strcpy(s->name, name);
    s->grade = grade;
    return s;
}

void print_all(Student *students[], int n) {
}

Student *find_best(Student *students[], int n) {
    return NULL;
}

int main(void) {
    int n = 4;
    Student *db[4];

    db[0] = create_student("Tommy", 95);
    db[1] = create_student("Lance", 82);
    db[2] = create_student("Cortez", 98);
    db[3] = create_student("Rex", 76);

    print_all(db, n);

    Student *best = find_best(db, n);
    printf("Best: %s (%d)\n", best->name, best->grade);

    for (int i = 0; i < n; i++) {
        free(db[i]);
    }

    return 0;
}
