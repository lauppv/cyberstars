def summary(*weights):
    heaviest = 0
    if weights:
        heaviest = max(weights)
    return f"boxes {len(weights)}, total {sum(weights)} kg, heaviest {heaviest} kg"


boxes = [10, 25, 10]
print(summary(*boxes))
print(summary())
if len(boxes) == 1:
    print(summary(boxes[0]))
else:
    print(summary(boxes[0], boxes[-1]))
