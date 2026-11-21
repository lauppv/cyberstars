class StationError(Exception):
    pass


class UnknownShip(StationError):
    pass


class NotEnoughFuel(StationError):
    pass


def refuel(name, amount, stock, known):
    if name not in known:
        return stock, "refused, unknown ship"
    if amount > stock:
        return stock, f"short by {amount - stock}"
    return stock - amount, ""


stock = 100
known = ["Hope", "Swift"]
requests = ["Hope 40", "Bob 10", "Swift 80", "Swift 50"]

missing = 0
for request in requests:
    name, amount = request.split()
    stock, problem = refuel(name, int(amount), stock, known)
    if problem == "":
        print(f"{name}: got {amount}")
    else:
        if problem.startswith("short by "):
            missing += int(problem[9:])
        print(f"{name}: {problem}")
print(f"Left: {stock}")
print(f"Missing in total: {missing}")
