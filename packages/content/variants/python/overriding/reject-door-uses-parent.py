class Alarm:
    def __init__(self, place):
        self.place = place

    def message(self):
        return f"Alarm in {self.place}"


class FireAlarm(Alarm):
    def message(self):
        return super().message() + ": fire, leave now"


class DoorAlarm(Alarm):
    def message(self):
        return super().message() + ": door open"


places = ["Dock", "Lab", "Gym"]
kinds = ["basic", "fire", "door"]
classes = {"basic": Alarm, "fire": FireAlarm, "door": DoorAlarm}
for a in [classes[k](p) for p, k in zip(places, kinds)]:
    print(a.message())
print(f"Fire alarms: {kinds.count('fire')}")
