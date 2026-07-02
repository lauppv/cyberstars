Combine **malloc/free**, **enums**, and **typedef**

---

## Mission: The Technical Intervention Queue

A short-circuit fire has knocked out half the computer room. The shift technician needs a dynamic task tracker to manage the repair jobs. Each task is heap-allocated, has a status, and must be freed when the queue is cleared.

1. Define **typedef enum { TODO, IN_PROGRESS, DONE } Status;**
2. Define **typedef struct { char title[100]; Status status; } Task;**
3. Write **Task \*create_task(const char \*title)** — allocates a Task with malloc, copies the title, sets the status to **TODO**, returns the pointer
4. Write **void update_status(Task \*t, Status s)** — updates the task's status
5. Write **const char \*status_name(Status s)** — returns "TODO", "IN_PROGRESS", or "DONE" (use a switch)
6. Write **void print_task(Task \*t)** — prints the task as **"[STATUS] Title"**
7. Read from input a count **n** of tasks, followed by **n** lines, each with a title (a single word) and a status code (**0** = TODO, **1** = IN_PROGRESS, **2** = DONE). Create each task and update it to the status read
8. Print all the tasks, in order, then free the memory

**Example**

Input

```text
3
Check_tape 2
Fix_teletype 1
Recalibrate_reader 0
```

Output

```text
[DONE] Check_tape
[IN_PROGRESS] Fix_teletype
[TODO] Recalibrate_reader
```

**Example**

Input

```text
2
Replace_fuse 2
Clean_fans 0
```

Output

```text
[DONE] Replace_fuse
[TODO] Clean_fans
```
