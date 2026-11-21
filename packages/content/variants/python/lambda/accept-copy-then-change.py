def change_all(prices, rule):
    result = list(prices)
    for i in range(len(result)):
        result[i] = rule(result[i])
    return result


prices = [23, 40, 7]
fee = 5
print(f"Half price: {change_all(prices, lambda x: int(x / 2))}")
print(f"With fee: {change_all(prices, lambda x: x + fee)}")
print(f"Rounded up: {change_all(prices, lambda x: -(-x // 10) * 10)}")
print(f"Original: {prices}")
