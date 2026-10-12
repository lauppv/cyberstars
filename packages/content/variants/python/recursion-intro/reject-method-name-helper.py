def append(lst, x):
    lst.append(x)

def power(base, exp):
    result = 1
    for _ in range(exp):
        result *= base
    return result

base = 2
lines = []
for exp in range(5):
    append(lines, f"{base}^{exp} = {power(base, exp)}")
print("\n".join(lines))
