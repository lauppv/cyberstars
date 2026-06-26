Our final mini-project: a **to-do list manager**. We'll build functions to **add**, **remove**, **mark as done**, and **display** tasks. This ties together everything: **lists**, **dictionaries**, **functions**, **loops**, **if/else**, and **string formatting**

---

Each task is a dictionary with a **name** and a **done** status

```py
task = {"name": "Learn Python", "done": False}
```

Our to-do list is a **list** of these dictionaries

```py
todos = [
    {"name": "Learn Python", "done": True},
    {"name": "Build a project", "done": False},
    {"name": "Get a job at CyberStars", "done": False}
]
```

---

Let's build the functions one by one

**Adding a task**

```py
def add_task(todos, name):
    todos.append({"name": name, "done": False})
```

**Marking a task as done** (by index)

```py
def complete_task(todos, index):
    if 0 <= index < len(todos):
        todos[index]["done"] = True
```

**Removing a task** (by index)

```py
def remove_task(todos, index):
    if 0 <= index < len(todos):
        todos.pop(index)
```

**.pop(index)** removes the element at that position from the list

**Displaying all tasks**

```py
def display_todos(todos):
    for i, task in enumerate(todos):
        status = "done" if task["done"] else "not done"
        print(f"{i}. [{status}] {task['name']}")
```

---

Putting it all together

```py
todos = []

add_task(todos, "Finish Python curriculum")
add_task(todos, "Start Java curriculum")
add_task(todos, "Touch grass")

display_todos(todos)
print("---")

complete_task(todos, 0)
display_todos(todos)
print("---")

remove_task(todos, 2)
display_todos(todos)
```

Output

```text
0. [not done] Finish Python curriculum
1. [not done] Start Java curriculum
2. [not done] Touch grass
---
0. [done] Finish Python curriculum
1. [not done] Start Java curriculum
2. [not done] Touch grass
---
0. [done] Finish Python curriculum
1. [not done] Start Java curriculum
```

Each function does **one thing** and does it well. This is a core principle of good programming. The functions are small, easy to understand, and easy to test

---

A **count** function is useful too

```py
def count_done(todos):
    count = 0
    for task in todos:
        if task["done"]:
            count += 1
    return count

def count_not_done(todos):
    return len(todos) - count_done(todos)
```

---

## Mission: Mission Task Board

The crew tracks its work on a shared task board. You'll **read the tasks from input**, build the board, mark some as complete, then print it. Each task is a dictionary with a `name` and a `done` status, and the board is a list of those dictionaries.

Write three functions:

- **add_task(tasks, name)** — append a new task to the list with `done` set to `False`.
- **complete_task(tasks, index)** — mark the task at that index as done.
- **count_done(tasks)** — return how many tasks are done.

Then:

1. Read a number **N**, then read **N task names** (one per line) and add each one to the board.
2. Read one more line of **indices to complete**, separated by spaces (for example `0 2`), and mark each of those tasks as done.
3. **Display** the board: for each task print its index, then `. `, then `[done]` or `[pending]`, then the task name.
4. Finally print `Completed: ` followed by the number done, a `/`, and the total.

**Input** (typed by the user when the program runs):

```text
3
Run diagnostics
Refuel reactor
Chart course
0 2
```

**Output**

```text
0. [done] Run diagnostics
1. [pending] Refuel reactor
2. [done] Chart course
Completed: 2/3
```
