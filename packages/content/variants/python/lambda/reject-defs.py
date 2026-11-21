def change_all(prices, rule):
    return [rule(p) for p in prices]


def half(p):
    return p // 2


def up(p):
    return (p + 9) // 10 * 10


prices = [23, 40, 7]
fee = 5


def with_fee(p):
    return p + fee


print(f"Half price: {change_all(prices, half)}")
print(f"With fee: {change_all(prices, with_fee)}")
print(f"Rounded up: {change_all(prices, up)}")
print(f"Original: {prices}")
