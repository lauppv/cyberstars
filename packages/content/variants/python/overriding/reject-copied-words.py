class Alarm:
    def __init__(self, place):
        self.place = place

    def message(self):
        return f"Alarm in {self.place}"


class FireAlarm(Alarm):
    def message(self):
        return f"Alarm in {self.place}: fire, leave now"


class DoorAlarm(Alarm):
    def message(self):
        return f"Door open in {self.place}"


places = ["Dock", "Lab", "Gym"]
kinds = ["basic", "fire", "door"]
classes = {"basic": Alarm, "fire": FireAlarm, "door": DoorAlarm}
for a in [classes[k](p) for p, k in zip(places, kinds)]:
    print(a.message())
print(f"Fire alarms: {kinds.count('fire')}")
