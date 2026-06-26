```py
readings = [75, 30, 95, 88, 42, 92]

high = [r for r in readings if r > 80]
doubled = [r * 2 for r in readings]
passing = [r for r in readings if r >= 50]

print(high)
print(doubled)
print(passing)
```
