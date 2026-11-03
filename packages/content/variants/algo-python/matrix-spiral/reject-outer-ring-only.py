n = int(input())
m = [input().split() for _ in range(n)]
out = list(m[0])
out += [m[i][n - 1] for i in range(1, n)]
if n > 1:
    out += [m[n - 1][j] for j in range(n - 2, -1, -1)]
    out += [m[i][0] for i in range(n - 2, 0, -1)]
print(" ".join(out))
