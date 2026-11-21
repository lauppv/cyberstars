```py
rezervoare = [1250.5, 87.25, 30000]

total = 0
for i in range(len(rezervoare)):
    print(f"Rezervor {i + 1:02}: {rezervoare[i]:>10,.2f} L")
    total = total + rezervoare[i]
print(f"Total:       {total:>10,.2f} L")
```
