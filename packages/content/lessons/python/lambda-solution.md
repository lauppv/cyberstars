```py
def change_all(prices, rule):
    changed = []
    for price in prices:
        changed.append(rule(price))
    return changed


prices = [23, 40, 7]
fee = 5

print(f"Half price: {change_all(prices, lambda p: p // 2)}")
print(f"With fee: {change_all(prices, lambda p: p + fee)}")
print(f"Rounded up: {change_all(prices, lambda p: (p + 9) // 10 * 10)}")
print(f"Original: {prices}")
```
