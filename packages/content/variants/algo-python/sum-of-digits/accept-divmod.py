n = abs(int(input()))
total = 0
while n:
    n, digit = divmod(n, 10)
    total += digit
print(total)
