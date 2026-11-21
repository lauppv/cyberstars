def change_all(prices, rule):
    return [rule(p) for p in prices]


prices = [23, 40, 7]
fee = 5
half = lambda p: p // 2
print("Half price:", change_all(prices, half))
print("With fee:", change_all(prices, lambda p: p + fee))
print("Rounded up:", change_all(prices, lambda p: p if p % 10 == 0 else (p // 10 + 1) * 10))
print("Original:", prices)
