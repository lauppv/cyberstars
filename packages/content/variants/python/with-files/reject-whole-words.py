messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"
with open("radio.txt", "w") as f:
    for m in messages:
        f.write(m + "\n")
with open("radio.txt") as src, open("alerts.txt", "w") as dst:
    for line in src.read().splitlines():
        if word in line.split():
            dst.write(line + "\n")
with open("alerts.txt") as f:
    alerts = f.read().splitlines()
for i, a in enumerate(alerts, 1):
    print(f"{i}. {a}")
print(f"Alerts: {len(alerts)}")
