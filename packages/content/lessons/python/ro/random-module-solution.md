```py
import random

seed = 3
echipaj = ["Ada", "Ben", "Cy", "Dee"]

random.seed(seed)
ordine = list(echipaj)
random.shuffle(ordine)
curatenie = random.choice(echipaj)
bonus = random.randint(1, 6)

print(f"Ordine: {', '.join(ordine)}")
print(f"Curatenie: {curatenie}")
print(f"Bonus: {bonus}")
print(f"Lista: {', '.join(echipaj)}")
```
