import random

seed = 3
crew = ["Ada", "Ben", "Cy", "Dee"]

random.seed(seed)
order = list(crew)
for i in reversed(range(1, len(order))):
    j = random.randrange(i + 1)
    order[i], order[j] = order[j], order[i]
cleaner = crew[random.randrange(len(crew))]
bonus = random.randrange(1, 7)

print(f"Order: {', '.join(order)}")
print(f"Cleaner: {cleaner}")
print(f"Bonus: {bonus}")
print(f"List: {', '.join(crew)}")
