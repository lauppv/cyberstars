items = ["milk", "bread", "con-eggs", "cheese", "con-yogurt", "butter", "jam"]
good = []
i = 0
while i < len(items):
    crate = items[i]
    i += 1
    if crate.startswith("con-"):
        continue
    good.append(crate)
    if crate == "butter":
        break
for crate in good:
    print(crate)
print("Total:", len(good))
