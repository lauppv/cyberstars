strengths = [30, 65, 20, 90, 50]
code = "ORBIT"


def add_all(values):
    acc = 0
    for v in values:
        acc += v
    return acc


def flip(text):
    out = ""
    for ch in text:
        out = ch + out
    return out


print(f"Sum: {add_all(strengths)}")
print(f"Strong: {[v for v in strengths if v > 50]}")
print(f"Reversed: {flip(code)}")
