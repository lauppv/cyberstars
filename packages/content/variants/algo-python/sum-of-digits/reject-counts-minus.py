text = input().strip()
total = 0
for ch in text:
    total += int(ch) if ch.isdigit() else 1
print(total)
