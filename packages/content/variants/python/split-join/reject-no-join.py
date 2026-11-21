crew = "ada lovelace,alan turing,grace hopper"
people = crew.split(",")
badges = ""
lasts = ""
for p in people:
    a, b = p.split()
    if badges != "":
        badges = badges + "-"
        lasts = lasts + ", "
    badges = badges + a[0].upper() + b[0].upper()
    lasts = lasts + b
print(f"People: {len(people)}")
print("Badges: " + badges)
print("Last names: " + lasts)
