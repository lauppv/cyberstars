log = "alpha beta alpha gamma beta alpha"


def split_codes(log):
    return log.split(" ")


def count_codes(codes):
    counts = {}
    for code in codes:
        counts[code] = counts.get(code, 0) + 1
    return counts


def most_common(counts):
    return list(counts)[0]


codes = split_codes(log)
counts = count_codes(codes)
print(f"Codes: {len(codes)}")
for code, count in counts.items():
    print(f"{code}: {count}")
print(f"Most common: {most_common(counts)}")
