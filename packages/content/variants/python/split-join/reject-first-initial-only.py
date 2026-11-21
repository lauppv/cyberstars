crew = "ada lovelace,alan turing,grace hopper"
people = crew.split(",")
badges = []
lasts = []
for p in people:
    a, b = p.split()
    badges.append(a[0].upper())
    lasts.append(b)
print(f"People: {len(people)}")
print("Badges: " + "-".join(badges))
print("Last names: " + ", ".join(lasts))
