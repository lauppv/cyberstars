def add_task(tasks, name):
    tasks.append({"name": name, "done": False})


def complete_task(tasks, index):
    if 0 <= index < len(tasks):
        tasks[index]["done"] = True


def count_done(tasks):
    return sum(1 for t in tasks if t["done"])


tasks = []
for _ in range(int(input())):
    add_task(tasks, input())
for x in input().split():
    complete_task(tasks, int(x))
for i, t in enumerate(tasks, 1):
    print(f"{i}. [{'done' if t['done'] else 'pending'}] {t['name']}")
print(f"Completed: {count_done(tasks)}/{len(tasks)}")
