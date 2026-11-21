class AirlockError(Exception):
    pass


class PressureError(AirlockError):
    def __init__(self, pressure):
        super().__init__(f"pressure {pressure} out of range")
        self.pressure = pressure


def open_airlock(text):
    p = int(text)
    if p < 90 or p > 110:
        raise PressureError(p)
    return "opened"


readings = ["100", "85", "abc", "110"]
opened = checks = 0
far = None
for r in readings:
    try:
        res = open_airlock(r)
    except PressureError as e:
        print(f"{r}: {e}")
        if far is None or abs(e.pressure - 100) >= abs(far - 100):
            far = e.pressure
    except ValueError:
        print(f"{r}: not a number")
    else:
        opened += 1
        print(f"{r}: {res}")
    finally:
        checks += 1
print(f"Opened: {opened}")
print(f"Seal checks: {checks}")
print(f"Farthest: {'none' if far is None else far}")
