def change_all(prices, rule):
    return [rule(p) for p in prices]


prices = [23, 40, 7]
fee = 5
print(f"Half price: {change_all(prices, lambda p: p // 2)}")
print(f"With fee: {change_all(prices, lambda p: p + fee)}")
print(f"Rounded up: {change_all(prices, lambda p: (p // 10 + 1) * 10)}")
print(f"Original: {prices}")
