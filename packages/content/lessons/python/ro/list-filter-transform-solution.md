```py
citiri = [45, 82, 67, 91, 38, 74, 55, 96, 12, 60]

cu_impuls = []
for citire in citiri:
    if citire >= 50:
        cu_impuls.append(min(citire + 5, 100))

print(f"Cu impuls: {cu_impuls}")
print(f"Reactoare stabile: {len(cu_impuls)}")
print(f"Medie: {round(sum(cu_impuls) / len(cu_impuls))}")
```
