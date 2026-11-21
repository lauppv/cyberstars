stock = ["rice,12", "salt,3", "tea,40"]
out = open("stock.txt", "w")
out.write("\n".join(stock) + "\n")
out.close()
f = open("stock.txt", "r")
content = f.read()
f.close()
rows = [r.split(",") for r in content.strip().split("\n")]
counts = [int(c) for _, c in rows]
print("Items:", len(rows))
print("Total:", sum(counts))
print("Most:", rows[counts.index(max(counts))][0])
try:
    open("old.txt").read()
    print("old.txt: found")
except FileNotFoundError:
    print("old.txt: missing")
