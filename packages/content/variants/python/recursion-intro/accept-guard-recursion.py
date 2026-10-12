def power(b, e):
    return 1 if e <= 0 else b * power(b, e - 1)


base = 2
for k in range(0, 5):
    print(str(base) + "^" + str(k) + " = " + str(power(base, k)))
