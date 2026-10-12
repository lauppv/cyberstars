```py
readings = [42, 75, 100, 30, 88, 120, 55, 99]

low = 0
mid = 0
high = 0

for reading in readings:
    if reading < 50:
        low += 1
    elif reading < 100:
        mid += 1
    else:
        high += 1

print(f"Low: {low}")
print(f"Mid: {mid}")
print(f"High: {high}")
```
