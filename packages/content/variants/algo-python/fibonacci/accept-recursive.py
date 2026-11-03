def fib(k, memo={0: 0, 1: 1}):
    if k not in memo:
        memo[k] = fib(k - 1) + fib(k - 2)
    return memo[k]


n = int(input())
print(" ".join(str(fib(i)) for i in range(n)))
