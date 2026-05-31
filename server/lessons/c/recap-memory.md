Combine **malloc/free**, **enums**, and **typedef**

---

## Mission: Repair Queue Tracker

The station took damage from a micrometeorite shower. Phil needs a dynamic task tracker to manage repair jobs. Each task is heap-allocated, has a status, and must be freed when the queue is cleared.

The data is already on the right. Do the following, in order:

1. Write **Task *createTask(const char *title)** — allocates a Task with malloc, copies the title, sets status to **TODO**, returns the pointer
2. Write **void updateStatus(Task \*t, Status s)** — updates the task's status
3. Write **const char \*statusName(Status s)** — returns "TODO", "IN_PROGRESS", or "DONE" (use a switch)
4. Write **void printTask(Task \*t)** — prints the task as **"[STATUS] Title"**
5. Create 3 tasks: "Learn pointers" (update to DONE), "Practice structs" (update to IN_PROGRESS), "Master malloc" (leave as TODO)
6. Print all three, then free the memory

**Output**

```text
[DONE] Learn pointers
[IN_PROGRESS] Practice structs
[TODO] Master malloc
```
