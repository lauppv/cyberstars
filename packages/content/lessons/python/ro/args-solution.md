```py
def rezumat(*greutati):
    cea_mai_grea = 0
    if len(greutati) > 0:
        cea_mai_grea = max(greutati)
    return f"cutii {len(greutati)}, total {sum(greutati)} kg, cea mai grea {cea_mai_grea} kg"


cutii = [10, 25, 10]

print(rezumat(*cutii))
print(rezumat())
print(rezumat(cutii[0], cutii[-1]))
```
