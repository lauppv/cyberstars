```c
#include <stdio.h>

typedef struct {
    char name[50];
    int grade;
} Student;

int main(void) {
    int n;
    scanf("%d", &n);

    Student students[50];
    for (int i = 0; i < n; i++) {
        scanf("%49s", students[i].name);
        scanf("%d", &students[i].grade);
    }

    // Insertion sort: at step i, the first i students are already sorted.
    // We move students[i] into the correct position by shifting to the right
    // any student with a greater grade. Insertion sort is stable because we
    // use > (not >=), so equal elements keep their original order.
    for (int i = 1; i < n; i++) {
        Student key = students[i];
        int j = i - 1;
        while (j >= 0 && students[j].grade > key.grade) {
            students[j + 1] = students[j];
            j--;
        }
        students[j + 1] = key;
    }

    for (int i = 0; i < n; i++) {
        printf("%s %d\n", students[i].name, students[i].grade);
    }

    return 0;
}
```
