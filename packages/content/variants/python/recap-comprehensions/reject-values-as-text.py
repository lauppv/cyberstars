def parse(lines):
    for line in lines:
        name, value = line.split(":")
        yield name, value


stream = ["temp:21", "air:98", "temp:23", "noise:4"]
print(f"Sensors: {sorted({n for n, v in parse(stream)})}")
print(f"Latest: { {n: v for n, v in parse(stream)} }")
print(f"Sum: {sum(int(v) for n, v in parse(stream))}")
