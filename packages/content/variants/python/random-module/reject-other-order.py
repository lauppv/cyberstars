import random

seed = 3
crew = ["Ada", "Ben", "Cy", "Dee"]
random.seed(seed)
cleaner = random.choice(crew)
order = list(crew)
random.shuffle(order)
bonus = random.randint(1, 6)
print(f"Order: {', '.join(order)}")
print(f"Cleaner: {cleaner}")
print(f"Bonus: {bonus}")
print(f"List: {', '.join(crew)}")
