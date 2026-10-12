```py
code = input()
has_upper = False
has_digit = False

for char in code:
    if char.isupper():
        has_upper = True
    elif char.isdigit():
        has_digit = True

long_enough = len(code) >= 6

print(f"Has uppercase: {has_upper}")
print(f"Has digit: {has_digit}")
print(f"Long enough: {long_enough}")
if has_upper and has_digit and long_enough:
    print("Access code valid")
else:
    print("Access code invalid")
```
