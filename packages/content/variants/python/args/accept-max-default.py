def summary(*w):
    return f"boxes {len(w)}, total {sum(w)} kg, heaviest {max(w, default=0)} kg"


boxes = [10, 25, 10]
for line in (summary(*boxes), summary(), summary(boxes[0], boxes[-1])):
    print(line)
