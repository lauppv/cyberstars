#include <stdio.h>

typedef struct {
    char name[32];
    int grade;
} Student;

int main(void) {
    static Student s[20000];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%31s %d", s[i].name, &s[i].grade);
    for (int g = 0; g <= 100; g++) {
        for (int i = 0; i < n; i++) {
            if (s[i].grade == g) printf("%s %d\n", s[i].name, s[i].grade);
        }
    }
    return 0;
}
