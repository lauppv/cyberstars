def power(base, exp):
    if exp == 0:
        return 1
    smaller = power(base, exp - 1)
    return smaller * base

def line(b, e):
    return f"{b}^{e} = {power(b, e)}"

base = 2
for e in [0, 1, 2, 3, 4]:
    print(line(base, e))
