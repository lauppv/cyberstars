messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"
f = open("radio.txt", "w")
for m in messages:
    f.write(m + "\n")
f.close()
with open("radio.txt") as src, open("alerts.txt", "w") as dst:
    for line in src.read().splitlines():
        if word in line:
            dst.write(line + "\n")
with open("alerts.txt") as f:
    alerts = f.read().splitlines()
for i, a in enumerate(alerts, 1):
    print(f"{i}. {a}")
print(f"Alerts: {len(alerts)}")
