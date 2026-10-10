def add_task(tasks, name):
    tasks += [{"name": name, "done": False}]


def complete_task(tasks, index):
    tasks[index]["done"] = True


def count_done(tasks):
    c = 0
    for t in tasks:
        if t["done"]:
            c += 1
    return c


tasks = []
total = int(input())
while len(tasks) < total:
    add_task(tasks, input())
indices = [int(x) for x in input().split()]
for idx in indices:
    complete_task(tasks, idx)
for pos, t in enumerate(tasks):
    print(f"{pos}. [{'done' if t['done'] else 'pending'}] {t['name']}")
print(f"Completed: {count_done(tasks)}/{total}")
