messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"
with open("radio.txt", "w") as out:
    out.write("\n".join(messages) + "\n")
with open("radio.txt") as a, open("alerts.txt", "w") as b:
    for line in a:
        if word in line:
            b.write(line)
count = 0
with open("alerts.txt") as f:
    for line in f:
        count += 1
        print(f"{count}. {line.strip()}")
print("Alerts:", count)
