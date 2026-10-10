codes = ["racecar", "signal", "level", "orbit", "radar"]
valid = 0
for code in codes:
    same = True
    for i in range(len(code)):
        if code[i] != code[-1 - i]:
            same = False
    print(f"{code}: {same}")
    valid += same
print(f"Valid signals: {valid}")
