#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
char name[50];
int grade;
} Student;

Student *createStudent(const char *name, int grade) {
Student \*s = malloc(sizeof(Student));
strcpy(s->name, name);
s->grade = grade;
return s;
}

void printAll(Student \*students[], int n) {
// print each student as "Name: Grade"
}

Student *findBest(Student *students[], int n) {
// return pointer to student with highest grade
return NULL;
}

int main(void) {
int n = 4;
Student \*db[4];

    db[0] = createStudent("Ana", 95);
    db[1] = createStudent("Mihai", 82);
    db[2] = createStudent("Elena", 98);
    db[3] = createStudent("Radu", 76);

    printAll(db, n);

    Student *best = findBest(db, n);
    printf("Best: %s (%d)\n", best->name, best->grade);

    // free all memory
    for (int i = 0; i < n; i++) {
        free(db[i]);
    }

    return 0;

}
