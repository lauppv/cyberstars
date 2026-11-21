stock = ["rice,12", "salt,3", "tea,40"]
f = open("stock.txt", "w")
for s in stock:
    f.write(f"{s}\n")
f.close()
text = open("stock.txt").read()
best, best_n, total, n = None, -1, 0, 0
for line in text.splitlines():
    name, num = line.split(",")
    n += 1
    total += int(num)
    if int(num) > best_n:
        best, best_n = name, int(num)
print(f"Items: {n}")
print(f"Total: {total}")
print(f"Most: {best}")
try:
    lines = open("old.txt").read().splitlines()
    print(f"old.txt: {len(lines)}")
except OSError:
    print("old.txt: missing")
