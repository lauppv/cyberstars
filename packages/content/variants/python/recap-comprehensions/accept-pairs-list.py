def parse(lines):
    for line in lines:
        name, value = line.split(":")
        yield name, int(value)


stream = ["temp:21", "air:98", "temp:23", "noise:4"]
pairs = list(parse(stream))
print("Sensors:", sorted({n for n, v in pairs}))
print("Latest:", {n: v for n, v in pairs})
print("Sum:", sum(v for _, v in pairs))
