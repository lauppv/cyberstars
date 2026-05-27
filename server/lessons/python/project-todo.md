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
def addTask(todos, name):
    todos.append({"name": name, "done": False})
```

**Marking a task as done** (by index)

```py
def completeTask(todos, index):
    if 0 <= index < len(todos):
        todos[index]["done"] = True
```

**Removing a task** (by index)

```py
def removeTask(todos, index):
    if 0 <= index < len(todos):
        todos.pop(index)
```

**.pop(index)** removes the element at that position from the list

**Displaying all tasks**

```py
def displayTodos(todos):
    for i, task in enumerate(todos):
        status = "done" if task["done"] else "not done"
        print(f"{i}. [{status}] {task['name']}")
```

---

Putting it all together

```py
todos = []

addTask(todos, "Finish Python curriculum")
addTask(todos, "Start Java curriculum")
addTask(todos, "Touch grass")

displayTodos(todos)
print("---")

completeTask(todos, 0)
displayTodos(todos)
print("---")

removeTask(todos, 2)
displayTodos(todos)
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
def countDone(todos):
    count = 0
    for task in todos:
        if task["done"]:
            count += 1
    return count

def countNotDone(todos):
    return len(todos) - countDone(todos)
```

---

Write the functions **addTask**, **completeTask**, and **countDone**

- **addTask(todos, name)** — adds a new task (not done) to the list
- **completeTask(todos, index)** — marks the task at that index as done
- **countDone(todos)** — returns how many tasks are done

The starter code on the right already calls these functions. Make them work so the output is

Expected output

```text
3
1
2
```

(3 total tasks, 1 done after completing first, 2 done after completing second)
