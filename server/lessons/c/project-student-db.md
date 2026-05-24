Time for a real project! We'll build a **student database** that uses everything we've learned: structs, pointers, dynamic memory, arrays, and string functions

The program manages a list of students. Each student has a **name** and a **grade**. We'll:
1. Create students dynamically with **malloc**
2. Store them in an array
3. Print all students
4. Find the student with the highest grade
5. Free the memory

---

Here's the struct we'll use
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

int main(void) {
    Student s = {"Ana", 95};
    printf("%s: %d\n", s.name, s.grade);
    return 0;
}
```

And here's how to create a student dynamically
```c
Student *createStudent(const char *name, int grade) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->name[sizeof(s->name) - 1] = '\0';
    s->grade = grade;
    return s;
}
```

The function allocates memory on the heap, fills in the fields, and returns a pointer. The caller is now **responsible** for freeing that memory later

---

To print all students
```c
void printAll(Student *students[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", students[i]->name, students[i]->grade);
    }
}
```

Notice we use **students[i]->name** because each element is a **pointer to a Student**

---

To find the best student
```c
Student *findBest(Student *students[], int n) {
    Student *best = students[0];
    for (int i = 1; i < n; i++) {
        if (students[i]->grade > best->grade) {
            best = students[i];
        }
    }
    return best;
}
```

---

Your task: complete the program. Create **4 students**:
- "Ana", 95
- "Mihai", 82
- "Elena", 98
- "Radu", 76

Print all students, then print the best student, then free all memory

Expected output
```text
Ana: 95
Mihai: 82
Elena: 98
Radu: 76
Best: Elena (98)
```

The skeleton code is on the right. Fill in the missing parts!
