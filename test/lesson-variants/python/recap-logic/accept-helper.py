def verdict(value):
    if value < 0:
        return None
    return "System OK" if value >= 50 else "Critical system"


readings = []
while True:
    x = int(input())
    if x == 0:
        break
    readings.append(x)

bad = False
for x in readings:
    msg = verdict(x)
    if msg:
        print(msg)
        if msg == "Critical system":
            bad = True
print("Launch aborted" if bad else "Launch authorized")
