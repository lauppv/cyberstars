log = "alpha beta alpha gamma beta alpha"


def split_codes(s):
    return s.split(" ")


def count_codes(lst):
    d = {}
    i = 0
    while i < len(lst):
        if lst[i] not in d:
            d[lst[i]] = 0
        d[lst[i]] += 1
        i += 1
    return d


def most_common(d):
    top = None
    for k, v in d.items():
        if top is None or v > d[top]:
            top = k
    return top


c = count_codes(split_codes(log))
print(f"Codes: {sum(c.values())}")
for k, v in c.items():
    print(f"{k}: {v}")
print(f"Most common: {most_common(c)}")
