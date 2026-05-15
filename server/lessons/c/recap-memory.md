Combine **malloc/free**, **enums**, and **typedef**

---

Build a **task manager** using dynamic memory. Define:

```c
typedef enum { TODO, IN_PROGRESS, DONE } Status;
```

```c
typedef enum { TODO, IN_PROGRESS, DONE } Status;

typedef struct {
    char title[100];
    Status status;
} Task;
```

Write these functions:

**Task \*createTask(const char \*title)** — allocates a Task with malloc, copies the title, sets status to **TODO**, returns the pointer

**void updateStatus(Task \*t, Status s)** — updates the task's status

**const char \*statusName(Status s)** — returns "TODO", "IN_PROGRESS", or "DONE" as a string (use a switch)

**void printTask(Task \*t)** — prints the task as **"[STATUS] Title"**

In main, create 3 tasks dynamically:
- "Learn pointers" → update to DONE
- "Practice structs" → update to IN_PROGRESS
- "Master malloc" → leave as TODO

Print all three, then free the memory

Expected output
```text
[DONE] Learn pointers
[IN_PROGRESS] Practice structs
[TODO] Master malloc
```
