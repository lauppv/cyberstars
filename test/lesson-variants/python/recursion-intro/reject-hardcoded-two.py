def power(base, exp):
    if exp == 0:
        return 1
    return 2 * power(base, exp - 1)

base = 2
for exp in range(5):
    print(f"2^{exp} = {power(base, exp)}")
