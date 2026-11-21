def summary(*weights):
    total = 0
    top = 0
    for w in weights:
        total += w
        if w > top:
            top = w
    return "boxes " + str(len(weights)) + ", total " + str(total) + " kg, heaviest " + str(top) + " kg"


boxes = [10, 25, 10]
print(summary(*boxes))
print(summary())
print(summary(boxes[0], boxes[len(boxes) - 1]))
