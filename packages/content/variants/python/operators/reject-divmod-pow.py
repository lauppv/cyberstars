first, second = int(input()), int(input())
q, r = divmod(first, second)
print(first + second, first - second, first * second, first / second, q, r, pow(first, second), sep="\n")
