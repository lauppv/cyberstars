```py
def add_task(tasks, name):
    tasks.append({"name": name, "done": False})

def complete_task(tasks, index):
    if 0 <= index < len(tasks):
        tasks[index]["done"] = True

def count_done(tasks):
    done = 0
    for task in tasks:
        if task["done"]:
            done += 1
    return done

tasks = []
n = int(input())
for i in range(n):
    name = input()
    add_task(tasks, name)

for index in input().split():
    complete_task(tasks, int(index))

for i, task in enumerate(tasks):
    status = "done" if task["done"] else "pending"
    print(f"{i}. [{status}] {task['name']}")
print(f"Completed: {count_done(tasks)}/{len(tasks)}")
```
