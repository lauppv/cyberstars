def parse(line):
    values = []
    for piece in line.split(" "):
        values.append(int(piece))
    big = values[0]
    small = values[0]
    for v in values:
        if v > big:
            big = v
        if v < small:
            small = v
    return [values[0] + values[1] + values[2], big, small]


line = input()
a, b, c = parse(line)
print(f"Total: {a}\nLargest: {b}\nSmallest: {c}")
