messages = ["dock clear", "fire in lab", "lab door open"]
word = "lab"

text = ""
for message in messages:
    text = text + message + "\n"
open("radio.txt", "w").write(text)

alerts_text = ""
for line in open("radio.txt").read().splitlines():
    if word in line:
        alerts_text = alerts_text + line + "\n"
open("alerts.txt", "w").write(alerts_text)

alerts = open("alerts.txt").read().splitlines()

for number, alert in enumerate(alerts, start=1):
    print(f"{number}. {alert}")
print(f"Alerts: {len(alerts)}")
