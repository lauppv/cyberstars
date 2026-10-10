log = "alpha beta alpha gamma beta alpha"


def split_codes(text):
    return text.split()


def count_codes(items):
    tally = {}
    for it in items:
        tally[it] = tally.get(it, 0) + 1
    return tally


def most_common(tally):
    return max(tally, key=tally.get)


parts = split_codes(log)
tally = count_codes(parts)
print("Codes:", len(parts))
for key in tally:
    print(f"{key}: {tally[key]}")
print("Most common:", most_common(tally))
