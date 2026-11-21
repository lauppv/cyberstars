def parse(lines):
    for line in lines:
        name, value = line.split(":")
        yield name, int(value)


stream = ["temp:21", "air:98", "temp:23", "noise:4"]
latest = {n: v for n, v in parse(stream)}
print(f"Sensors: {sorted({n for n in latest})}")
print(f"Latest: {latest}")
print(f"Sum: {sum(v for v in latest.values())}")
