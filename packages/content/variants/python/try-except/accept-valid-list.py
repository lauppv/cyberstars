readings = ["42", "x9", "100", "7", "bad", "13"]
valid = []
broken = 0
for text in readings:
    try:
        valid.append(int(text))
    except ValueError:
        broken += 1
print("Total:", sum(valid))
print("Corrupted:", broken)
