codes = [1234, 999, 5, 4070, 88]


def sum_digits(n):
    if n == 0:
        return 0
    return sum_digits(n // 10) + n % 10


sums = []
i = 0
while i < len(codes):
    s = sum_digits(codes[i])
    print(codes[i], ": ", s, sep="")
    sums.append(s)
    i += 1
print("Largest checksum:", max(sums))
