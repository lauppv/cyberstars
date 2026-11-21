crew = "ada lovelace,alan turing,grace hopper"
names = crew.split(",")
initials = []
lasts = []
for i in range(len(names)):
    first, last = names[i].split(" ")
    initials.append((first[0] + last[0]).upper())
    lasts.append(last)
print("People:", len(names))
print("Badges: " + "-".join(initials))
print("Last names: " + ", ".join(lasts))
