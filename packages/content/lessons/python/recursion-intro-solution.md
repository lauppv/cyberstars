```py
def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

base = 2
for exp in range(5):
    print(f"{base}^{exp} = {power(base, exp)}")
```
