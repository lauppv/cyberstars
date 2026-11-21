import random

seed = 3
crew = ["Ada", "Ben", "Cy", "Dee"]

picker = random.Random(seed)
order = list(crew)
picker.shuffle(order)
cleaner = picker.choice(crew)
bonus = picker.randint(1, 6)

print(f"Order: {', '.join(order)}")
print(f"Cleaner: {cleaner}")
print(f"Bonus: {bonus}")
print(f"List: {', '.join(crew)}")
