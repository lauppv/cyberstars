```py
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
        return f"Door open in {self.place}"


places = ["Dock", "Lab", "Gym"]
kinds = ["basic", "fire", "door"]

classes = {"basic": Alarm, "fire": FireAlarm, "door": DoorAlarm}
alarms = [classes[kind](place) for place, kind in zip(places, kinds)]
for alarm in alarms:
    print(alarm.message())
print(f"Fire alarms: {kinds.count('fire')}")
```
