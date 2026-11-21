class StationError(Exception):
    pass


class UnknownShip(StationError):
    pass


class NotEnoughFuel(StationError):
    def __init__(self, missing):
        self.missing = missing
        super().__init__("short by " + str(missing))


def refuel(name, amount, stock, known):
    if name not in known:
        raise UnknownShip("unknown ship")
    if stock - amount < 0:
        raise NotEnoughFuel(amount - stock)
    return stock - amount


stock = 100
known = ["Hope", "Swift"]
requests = ["Hope 40", "Bob 10", "Swift 80", "Swift 50"]
total = 0
for r in requests:
    ship, n = r.split(" ")
    try:
        stock = refuel(ship, int(n), stock, known)
    except StationError as err:
        if isinstance(err, NotEnoughFuel):
            total += err.missing
            print(ship + ": " + str(err))
        else:
            print(ship + ": refused, " + str(err))
    else:
        print(ship + ": got " + n)
print("Left:", stock)
print("Missing in total:", total)
