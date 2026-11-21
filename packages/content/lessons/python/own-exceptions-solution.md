```py
class StationError(Exception):
    pass


class UnknownShip(StationError):
    pass


class NotEnoughFuel(StationError):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing


def refuel(name, amount, stock, known):
    if name not in known:
        raise UnknownShip("unknown ship")
    if amount > stock:
        raise NotEnoughFuel(amount - stock)
    return stock - amount


stock = 100
known = ["Hope", "Swift"]
requests = ["Hope 40", "Bob 10", "Swift 80", "Swift 50"]

missing = 0
for request in requests:
    name, amount = request.split()
    try:
        stock = refuel(name, int(amount), stock, known)
        print(f"{name}: got {amount}")
    except NotEnoughFuel as e:
        missing += e.missing
        print(f"{name}: {e}")
    except StationError as e:
        print(f"{name}: refused, {e}")
print(f"Left: {stock}")
print(f"Missing in total: {missing}")
```
