def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

base = 2
exp = 0
while exp < 5:
    print(f"{base}^{exp} = {power(base, exp)}")
    exp += 1
