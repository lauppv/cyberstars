Writing **struct Employee** everywhere gets tiring. **typedef** lets us create a shorter name for any type

```c
#include <stdio.h>

typedef struct {
    char name[50];
    int shift;
    int tasks;
} Employee;

int main(void) {
    Employee e = {"op7", 2, 5};
    printf("%s: shift %d\n", e.name, e.shift);
    return 0;
}
```

Now we write **Employee** instead of **struct Employee**. Much cleaner. This is how most C codebases define their structs

---

The pattern is **typedef existing_type new_name**

```c
#include <stdio.h>

typedef int Hours;
typedef char* Str;

int main(void) {
    Hours worked = 9999;
    Str name = "op7";
    printf("%d %s\n", worked, name);
    return 0;
}
```

We can give meaningful names to types. **Hours** is still an int underneath, but the name tells you what it represents

---

**typedef** really shines with function pointers (if you're curious) and by dropping the **struct** keyword. Here's the most common pattern you'll see in real code

```c
#include <stdio.h>

typedef struct {
    int register_id;
    int value;
} Cell;

typedef struct {
    Cell first;
    int total;
} Bank;

void print_bank(Bank *b) {
    printf("Register: %d, Value: %d, Total: %d\n",
           b->first.register_id, b->first.value, b->total);
}

int main(void) {
    Bank b = {{0, 512}, 512};
    print_bank(&b);
    return 0;
}
```

Notice how we can use **Cell** inside **Bank**. Structs within structs — **composition**. This is how C programs build complex data structures without classes

---

## Mission: Shift Performance Report

The shift supervisor wants a formatted report of the computing center's operator evaluations. Use **typedef** to define a clean struct and walk through the list.

1. Define a **typedef** struct named **Operator** with fields: **name** (char array), **grade** (int), **rating** (double)
2. Read from input a count **n** of operators, followed by **n** lines, each with **name grade rating**
3. Walk through them and print each in the format **"Name - Grade X - Rating Y.YY"**

**Example**

Input

```text
3
op1 10 9.50
op2 11 8.20
op3 10 9.80
```

Output

```text
op1 - Grade 10 - Rating 9.50
op2 - Grade 11 - Rating 8.20
op3 - Grade 10 - Rating 9.80
```

**Example**

Input

```text
2
shift1 7 6.75
shift2 9 8.00
```

Output

```text
shift1 - Grade 7 - Rating 6.75
shift2 - Grade 9 - Rating 8.00
```
