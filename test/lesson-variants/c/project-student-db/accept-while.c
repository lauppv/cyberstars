#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

Student *create_student(const char *name, int grade) {
    Student *s = (Student *)malloc(sizeof(Student));
    strcpy(s->name, name);
    s->grade = grade;
    return s;
}

void print_all(Student *students[], int n) {
    int i = 0;
    while (i < n) {
        printf("%s: %d\n", students[i]->name, students[i]->grade);
        i++;
    }
}

Student *find_top(Student *students[], int n) {
    Student *top = students[--n];
    while (n-- > 0)
        if (students[n]->grade >= top->grade) top = students[n];
    return top;
}

int main(void) {
    int n;
    scanf("%d", &n);
    Student *db[100];
    int i = 0;
    while (i < n) {
        char name[50];
        int grade;
        scanf("%s %d", name, &grade);
        db[i++] = create_student(name, grade);
    }
    print_all(db, n);
    Student *top = find_top(db, n);
    printf("Top student: %s (%d)\n", top->name, top->grade);
    while (i > 0) free(db[--i]);
    return 0;
}
