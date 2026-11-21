```py
crew = "ada lovelace,alan turing,grace hopper"

people = crew.split(",")
badges = []
last_names = []
for person in people:
    parts = person.split()
    badges.append(parts[0][0].upper() + parts[1][0].upper())
    last_names.append(parts[1])

print(f"People: {len(people)}")
print(f"Badges: {'-'.join(badges)}")
print(f"Last names: {', '.join(last_names)}")
```
