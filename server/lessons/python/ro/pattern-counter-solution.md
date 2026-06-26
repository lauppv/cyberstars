```py
citiri = [42, 75, 100, 30, 88, 120, 55, 99]

mici = 0
medii = 0
mari = 0

for citire in citiri:
    if citire < 50:
        mici += 1
    elif citire < 100:
        medii += 1
    else:
        mari += 1

print(f"Mici: {mici}")
print(f"Medii: {medii}")
print(f"Mari: {mari}")
```
