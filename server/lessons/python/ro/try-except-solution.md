```py
citiri = ["42", "x9", "100", "7", "bad", "13"]

total = 0
corupte = 0
for citire in citiri:
    try:
        total = total + int(citire)
    except ValueError:
        corupte = corupte + 1

print(f"Total: {total}")
print(f"Corupte: {corupte}")
```
