class Alarm:
    def __init__(self, place, kind):
        self.place = place
        self.kind = kind

    def message(self):
        if self.kind == "fire":
            return f"Alarm in {self.place}: fire, leave now"
        if self.kind == "door":
            return f"Door open in {self.place}"
        return f"Alarm in {self.place}"


class FireAlarm(Alarm):
    pass


class DoorAlarm(Alarm):
    pass


places = ["Dock", "Lab", "Gym"]
kinds = ["basic", "fire", "door"]
for a in [Alarm(p, k) for p, k in zip(places, kinds)]:
    print(a.message())
print(f"Fire alarms: {kinds.count('fire')}")
super
