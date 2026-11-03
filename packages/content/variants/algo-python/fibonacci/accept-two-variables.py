n = int(input())
a, b = 0, 1
out = []
for _ in range(n):
    out.append(a)
    a, b = b, a + b
print(*out)
