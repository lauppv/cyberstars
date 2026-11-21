def parse(lines):
    for line in lines:
        name, value = line.split(":")
        yield name, int(value)


stream = ["temp:21", "air:98", "temp:23", "noise:4"]
pairs = list(parse(stream))
print(f"Sensors: {sorted({n for n, v in pairs})}")
print(f"Latest: { {n: v for n, v in reversed(pairs)} }")
print(f"Sum: {sum(v for n, v in pairs)}")
