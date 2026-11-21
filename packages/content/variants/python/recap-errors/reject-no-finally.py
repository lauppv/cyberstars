class AirlockError(Exception):
    pass


class PressureError(AirlockError):
    def __init__(self, pressure):
        super().__init__(f"pressure {pressure} out of range")
        self.pressure = pressure


def open_airlock(text):
    pressure = int(text)
    if pressure < 90 or pressure > 110:
        raise PressureError(pressure)
    return "opened"


readings = ["100", "85", "abc", "110"]

opened = 0
checks = 0
farthest = None
for reading in readings:
    checks += 1
    try:
        result = open_airlock(reading)
    except PressureError as e:
        print(f"{reading}: {e}")
        if farthest is None or abs(e.pressure - 100) > abs(farthest - 100):
            farthest = e.pressure
    except ValueError:
        print(f"{reading}: not a number")
    else:
        opened += 1
        print(f"{reading}: {result}")

print(f"Opened: {opened}")
print(f"Seal checks: {checks}")
print(f"Farthest: {'none' if farthest is None else farthest}")
