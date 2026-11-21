def parse(lines):
    for line in lines:
        i = line.index(":")
        yield (line[:i], int(line[i + 1:]))


stream = ["temp:21", "air:98", "temp:23", "noise:4"]
names = sorted({p[0] for p in parse(stream)})
latest = {p[0]: p[1] for p in parse(stream)}
print(f"Sensors: {names}")
print(f"Latest: {latest}")
print(f"Sum: {sum(p[1] for p in parse(stream))}")
