```py
stock = ["rice,12", "salt,3", "tea,40"]

f = open("stock.txt", "w")
for line in stock:
    f.write(line + "\n")
f.close()

f = open("stock.txt")
lines = f.read().splitlines()
f.close()

total = 0
most_name = ""
most_count = -1
for line in lines:
    name, count = line.split(",")
    total += int(count)
    if int(count) > most_count:
        most_count = int(count)
        most_name = name

print(f"Items: {len(lines)}")
print(f"Total: {total}")
print(f"Most: {most_name}")

try:
    f = open("old.txt")
    print(f"old.txt: {len(f.read().splitlines())}")
    f.close()
except FileNotFoundError:
    print("old.txt: missing")
```
