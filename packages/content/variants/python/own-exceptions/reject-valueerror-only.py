def refuel(name, amount, stock, known):
    if name not in known:
        raise ValueError("refused, unknown ship")
    if amount > stock:
        raise ValueError(f"short by {amount - stock}")
    return stock - amount


stock = 100
known = ["Hope", "Swift"]
requests = ["Hope 40", "Bob 10", "Swift 80", "Swift 50"]
missing = 0
for r in requests:
    name, amount = r.split()
    try:
        stock = refuel(name, int(amount), stock, known)
        print(f"{name}: got {amount}")
    except ValueError as e:
        if str(e).startswith("short by "):
            missing += int(str(e)[9:])
        print(f"{name}: {e}")
print(f"Left: {stock}")
print(f"Missing in total: {missing}")
