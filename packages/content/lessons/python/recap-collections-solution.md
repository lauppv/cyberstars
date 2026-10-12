```py
items = ["milk", "bread", "con-eggs", "cheese", "con-yogurt", "butter", "jam"]

clean = []
for item in items:
    if item[0:4] == "con-":
        continue
    clean.append(item)
    if item == "butter":
        break

for item in clean:
    print(item)
print(f"Total: {len(clean)}")
```
