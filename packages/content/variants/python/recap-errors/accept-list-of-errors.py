class AirlockError(Exception):
    pass


class PressureError(AirlockError):
    def __init__(self, pressure):
        self.pressure = pressure
        super().__init__("pressure " + str(pressure) + " out of range")


def open_airlock(text):
    p = int(text)
    if not 90 <= p <= 110:
        raise PressureError(p)
    return "opened"


readings = ["100", "85", "abc", "110"]
opened = checks = 0
bad = []
for r in readings:
    try:
        answer = open_airlock(r)
    except PressureError as err:
        bad.append(err.pressure)
        print(r + ": " + str(err))
    except ValueError:
        print(r + ": not a number")
    else:
        opened += 1
        print(r + ": " + answer)
    finally:
        checks += 1
print("Opened:", opened)
print("Seal checks:", checks)
print("Farthest:", max(bad, key=lambda p: abs(p - 100)) if bad else "none")
