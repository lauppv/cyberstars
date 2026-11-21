crew = "ada lovelace,alan turing,grace hopper"
people = crew.split(",")
badges = []
lasts = []
for p in people:
    space = p.find(" ")
    badges.append(p[0].upper() + p[space + 1].upper())
    lasts.append(p[space + 1:])
print(f"People: {len(people)}")
print("Badges: " + "-".join(badges))
print("Last names: " + ", ".join(lasts))
