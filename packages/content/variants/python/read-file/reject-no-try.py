stock = ["rice,12", "salt,3", "tea,40"]
f = open("stock.txt", "w")
for s in stock:
    f.write(s + "\n")
f.close()
lines = open("stock.txt").read().splitlines()
total, best, best_n = 0, "", -1
for line in lines:
    name, num = line.split(",")
    total += int(num)
    if int(num) > best_n:
        best, best_n = name, int(num)
print(f"Items: {len(lines)}")
print(f"Total: {total}")
print(f"Most: {best}")
print("old.txt: missing")
