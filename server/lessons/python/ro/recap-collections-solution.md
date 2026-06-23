```py
elemente = ["lapte", "paine", "con-oua", "branza", "con-iaurt", "unt", "gem"]

curate = []
for element in elemente:
    if element[0:4] == "con-":
        continue
    curate.append(element)
    if element == "unt":
        break

for element in curate:
    print(element)
print(f"Total: {len(curate)}")
```
