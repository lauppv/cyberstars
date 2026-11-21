import random

seed = 3
crew = ["Ada", "Ben", "Cy", "Dee"]
random.seed(seed)
mixed = crew[:]
random.shuffle(mixed)
who = random.choice(crew)
points = random.randint(1, 6)
print("Order:", ", ".join(mixed))
print("Cleaner:", who)
print("Bonus:", points)
print("List:", ", ".join(crew))
