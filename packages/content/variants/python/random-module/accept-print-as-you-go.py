import random as r

seed = 3
crew = ["Ada", "Ben", "Cy", "Dee"]
r.seed(seed)
copy = crew.copy()
r.shuffle(copy)
print("Order: " + ", ".join(copy))
print("Cleaner: " + r.choice(crew))
print("Bonus: " + str(r.randint(1, 6)))
print("List: " + ", ".join(crew))
