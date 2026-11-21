import os

stock = ["rice,12", "salt,3", "tea,40"]

total = 0
most_name = ""
most_count = -1
for line in stock:
    name, count = line.split(",")
    total += int(count)
    if int(count) > most_count:
        most_count = int(count)
        most_name = name

print(f"Items: {len(stock)}")
print(f"Total: {total}")
print(f"Most: {most_name}")

if os.path.exists("old.txt"):
    print("old.txt: there")
else:
    print("old.txt: missing")
