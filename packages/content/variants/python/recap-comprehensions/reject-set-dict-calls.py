def parse(lines):
    for line in lines:
        parts = line.split(":")
        yield parts[0], int(parts[1])


stream = ["temp:21", "air:98", "temp:23", "noise:4"]

latest = dict(parse(stream))
sensors = set(latest)
total = sum(value for name, value in parse(stream))

print(f"Sensors: {sorted(sensors)}")
print(f"Latest: {latest}")
print(f"Sum: {total}")
