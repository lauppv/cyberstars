items = ["milk", "bread", "con-eggs", "cheese", "con-yogurt", "butter", "jam"]
clean = []
for item in items:
    if "con" in item:
        continue
    clean.append(item)
    if item == "butter":
        break
for item in clean:
    print(item)
print(f"Total: {len(clean)}")
