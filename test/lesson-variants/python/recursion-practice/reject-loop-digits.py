codes = [1234, 999, 5, 4070, 88]

def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

largest = 0
for code in codes:
    checksum = sum_digits(code)
    print(f"{code}: {checksum}")
    largest = max(largest, checksum)
print(f"Largest checksum: {largest}")
