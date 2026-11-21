def to_degrees(r):
    return r / 10


readings = [215, 380, 199, 402]
limit = 30


def hot(d):
    return d > limit


degrees = list(map(to_degrees, readings))
found = list(filter(hot, degrees))
print("Degrees: " + str(degrees))
print("Too hot: " + str(found))
print("Count: " + str(len(found)))
