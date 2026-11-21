class Alarm:
    def __init__(self, place):
        self.place = place

    def message(self):
        return "Alarm in " + self.place


class FireAlarm(Alarm):
    def message(self):
        return f"{super().message()}: fire, leave now"


class DoorAlarm(Alarm):
    def message(self):
        return "Door open in " + self.place


places = ["Dock", "Lab", "Gym"]
kinds = ["basic", "fire", "door"]
panel = []
for p, k in zip(places, kinds):
    if k == "fire":
        panel.append(FireAlarm(p))
    elif k == "door":
        panel.append(DoorAlarm(p))
    else:
        panel.append(Alarm(p))
for a in panel:
    print(a.message())
print("Fire alarms:", sum(isinstance(a, FireAlarm) for a in panel))
