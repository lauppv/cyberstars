codes = [1234, 999, 5, 4070, 88]

def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)

checksum = 0
for code in codes:
    checksum = sum_digits(code)
    print(f"{code}: {checksum}")
print(f"Largest checksum: {checksum}")
