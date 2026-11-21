messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"
with open("radio.txt", "w") as f:
    for m in messages:
        print(m, file=f)
with open("radio.txt", "r") as src, open("alerts.txt", "w") as dst:
    kept = [m for m in src.read().split("\n") if m and word in m]
    for m in kept:
        print(m, file=dst)
with open("alerts.txt") as f:
    lines = f.readlines()
for i in range(len(lines)):
    print(str(i + 1) + ". " + lines[i].rstrip("\n"))
print("Alerts: " + str(len(lines)))
