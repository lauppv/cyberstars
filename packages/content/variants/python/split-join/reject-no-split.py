crew = "ada lovelace,alan turing,grace hopper"

people = []
person = ""
for letter in crew + ",":
    if letter == ",":
        people.append(person)
        person = ""
    else:
        person = person + letter
badges = []
last_names = []
for person in people:
    space = person.index(" ")
    first = person[:space]
    last = person[space + 1:]
    badges.append(first[0].upper() + last[0].upper())
    last_names.append(last)

print(f"People: {len(people)}")
print(f"Badges: {'-'.join(badges)}")
print(f"Last names: {', '.join(last_names)}")
