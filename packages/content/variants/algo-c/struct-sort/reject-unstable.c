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
    for (int i = 0; i < n - 1; i++) {
        int low = i;
        for (int j = i + 1; j < n; j++) {
            if (s[j].grade < s[low].grade) low = j;
        }
        Student t = s[i];
        s[i] = s[low];
        s[low] = t;
    }
    for (int i = 0; i < n; i++) printf("%s %d\n", s[i].name, s[i].grade);
    return 0;
}
