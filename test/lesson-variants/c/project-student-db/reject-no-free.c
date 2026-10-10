#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { char name[50]; int grade; } Student;

Student *create_student(const char *name, int grade) {
    Student *s = malloc(sizeof(Student));
    strcpy(s->name, name);
    s->grade = grade;
    return s;
}

void print_all(Student *students[], int n) {
    for (int i = 0; i < n; i++) printf("%s: %d\n", students[i]->name, students[i]->grade);
}

Student *find_top(Student *students[], int n) {
    Student *top = students[0];
    for (int i = 1; i < n; i++)
        if (students[i]->grade > top->grade) top = students[i];
    return top;
}

int main(void) {
    int n;
    scanf("%d", &n);
    Student *db[100];
    for (int i = 0; i < n; i++) {
        char name[50];
        int grade;
        scanf("%s %d", name, &grade);
        db[i] = create_student(name, grade);
    }
    print_all(db, n);
    Student *top = find_top(db, n);
    printf("Top student: %s (%d)\n", top->name, top->grade);
    return 0;
}
