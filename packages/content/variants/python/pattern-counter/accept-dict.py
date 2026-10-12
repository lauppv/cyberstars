readings = [42, 75, 100, 30, 88, 120, 55, 99]
bands = {"Low": 0, "Mid": 0, "High": 0}
for value in readings:
    if value >= 100:
        bands["High"] += 1
    elif value >= 50:
        bands["Mid"] += 1
    else:
        bands["Low"] += 1
for name in bands:
    print(f"{name}: {bands[name]}")
