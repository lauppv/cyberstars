```py
messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"

with open("radio.txt", "w") as f:
    for message in messages:
        f.write(message + "\n")

with open("radio.txt") as source, open("alerts.txt", "w") as target:
    for line in source.read().splitlines():
        if word in line:
            target.write(line + "\n")

with open("alerts.txt") as f:
    alerts = f.read().splitlines()

for number, alert in enumerate(alerts, start=1):
    print(f"{number}. {alert}")
print(f"Alerts: {len(alerts)}")
```
