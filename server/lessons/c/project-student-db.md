Time for a real project. We will build a **student registry**, using everything we have learned: structs, pointers, dynamic memory, arrays and string functions

The program manages a list of students. Each student has a **name** and a **grade**. We will

1. Create students dynamically with **malloc**
2. Store them in an array of pointers
3. Print all students
4. Find the student with the highest grade
5. Free the memory

---

Here is the struct we will use

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[50];
    int grade;
} Student;

int main(void) {
    Student s = {"Ritchie", 95};
    printf("%s: %d\n", s.name, s.grade);
    return 0;
}
```

And here is how we create a student dynamically

```text
Student *create_student(const char *name, int grade) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->name, name, sizeof(s->name) - 1);
    s->name[sizeof(s->name) - 1] = '\0';
    s->grade = grade;
    return s;
}
```

The function allocates memory on the heap, fills in the fields and returns a pointer. The caller becomes **responsible** for freeing that memory later

---

To print all students

```text
void print_all(Student *students[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", students[i]->name, students[i]->grade);
    }
}
```

Notice **students[i]->name** — each element of the array is a **pointer to a Student**, so we use **->** instead of **.**

---

To find the top student

```text
Student *find_top(Student *students[], int n) {
    Student *top = students[0];
    for (int i = 1; i < n; i++) {
        if (students[i]->grade > top->grade) {
            top = students[i];
        }
    }
    return top;
}
```

---

## Mission: The computer lab registry

It's 1974. You are the shift operator at the university's computer lab. Students finishing the programming exam come to your teletype and dictate their name and grade — you enter them into the registry, one student at a time

Write a program that

1. Reads an integer **n** — the number of students
2. Reads, **n** times, a name and a grade (integer), and creates a student with **create_student**, storing the pointer in an array
3. Calls **print_all** to print each student as **"Name: Grade"**
4. Calls **find_top** and prints **"Top student: Name (Grade)"**
5. Frees all allocated memory, with **free**, before finishing

**Example**

Input

```text
4
Ritchie 95
Thompson 82
Kernighan 98
McIlroy 76
```

Output

```text
Ritchie: 95
Thompson: 82
Kernighan: 98
McIlroy: 76
Top student: Kernighan (98)
```

**Example**

Input

```text
2
Ana 88
Mihai 91
```

Output

```text
Ana: 88
Mihai: 91
Top student: Mihai (91)
```
