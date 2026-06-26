```py
strengths = [30, 65, 20, 90, 50]
code = "ORBIT"

total = 0
for strength in strengths:
    total += strength

strong = []
for strength in strengths:
    if strength > 50:
        strong.append(strength)

reversed_str = ""
for char in code:
    reversed_str = char + reversed_str

print(f"Sum: {total}")
print(f"Strong: {strong}")
print(f"Reversed: {reversed_str}")
```
