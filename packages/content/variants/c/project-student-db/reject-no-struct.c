#include <stdio.h>
#include <stdlib.h>

char *create_student(const char *name, int grade) {
    char *s = malloc(80);
    sprintf(s, "%d %s", grade, name);
    return s;
}

void print_all(char *students[], int n) {
    for (int i = 0; i < n; i++) {
        int grade;
        char name[64];
        sscanf(students[i], "%d %63s", &grade, name);
        printf("%s: %d\n", name, grade);
    }
}

char *find_top(char *students[], int n) {
    char *top = students[0];
    for (int i = 1; i < n; i++)
        if (atoi(students[i]) > atoi(top)) top = students[i];
    return top;
}

int main(void) {
    int n;
    scanf("%d", &n);
    char *db[100];
    for (int i = 0; i < n; i++) {
        char name[64];
        int grade;
        scanf("%63s %d", name, &grade);
        db[i] = create_student(name, grade);
    }
    print_all(db, n);
    char *top = find_top(db, n);
    int grade;
    char name[64];
    sscanf(top, "%d %63s", &grade, name);
    printf("Top student: %s (%d)\n", name, grade);
    for (int i = 0; i < n; i++) free(db[i]);
    return 0;
}
