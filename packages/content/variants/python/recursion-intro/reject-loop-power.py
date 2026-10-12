def power(base, exp):
    result = 1
    for _ in range(exp):
        result *= base
    return result

base = 2
for exp in range(5):
    print(f"{base}^{exp} = {power(base, exp)}")
