```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

Student *create_student(const char *name, int grade) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->name[sizeof(s->name) - 1] = '\0';
    s->grade = grade;
    return s;
}

void print_all(Student *students[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", students[i]->name, students[i]->grade);
    }
}

Student *find_top(Student *students[], int n) {
    Student *top = students[0];
    for (int i = 1; i < n; i++) {
        if (students[i]->grade > top->grade) {
            top = students[i];
        }
    }
    return top;
}

int main(void) {
    int n;
    scanf("%d", &n);

    Student *db[n];
    char name[50];
    int grade;

    for (int i = 0; i < n; i++) {
        scanf("%49s %d", name, &grade);
        db[i] = create_student(name, grade);
    }

    print_all(db, n);

    Student *top = find_top(db, n);
    printf("Top student: %s (%d)\n", top->name, top->grade);

    for (int i = 0; i < n; i++) {
        free(db[i]);
    }

    return 0;
}
```
