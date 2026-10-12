```py
log = "alpha beta alpha gamma beta alpha"

def split_codes(log):
    return log.split(" ")

def count_codes(codes):
    counts = {}
    for code in codes:
        if code in counts:
            counts[code] = counts[code] + 1
        else:
            counts[code] = 1
    return counts

def most_common(counts):
    best = ""
    highest = 0
    for code, count in counts.items():
        if count > highest:
            highest = count
            best = code
    return best

codes = split_codes(log)
counts = count_codes(codes)
print(f"Codes: {len(codes)}")
for code, count in counts.items():
    print(f"{code}: {count}")
print(f"Most common: {most_common(counts)}")
```
