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
    Student s = {"Tommy", 95};
    printf("%s: %d\n", s.name, s.grade);
    return 0;
}
```

And here's how to create a student dynamically

```c
Student *create_student(const char *name, int grade) {
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
void print_all(Student *students[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", students[i]->name, students[i]->grade);
    }
}
```

Notice we use **students[i]->name** because each element is a **pointer to a Student**

---

To find the best student

```c
Student *find_best(Student *students[], int n) {
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

## Mission: Station Crew Database

The station needs a personnel database that tracks every crew member's name and performance grade. You have the building blocks above — now wire them together into a working system.

1. Complete the **print_all** function to print each student as **"Name: Grade"**
2. Complete the **find_best** function to return a pointer to the student with the highest grade
3. In **main**, the 4 crew members are already created — call **print_all**, then **find_best**, and print the best one
4. Free all allocated memory at the end

**Input** (already set at the top of your code — change the values to test):

- **"Tommy"**, 95
- **"Lance"**, 82
- **"Cortez"**, 98
- **"Rex"**, 76

**Example**

With the starter values, your program should print

```text
Tommy: 95
Lance: 82
Cortez: 98
Rex: 76
Best: Cortez (98)
```
