class BankError(Exception):
    pass


class InvalidAmount(BankError):
    pass


class NotEnoughMoney(BankError):
    def __init__(self, missing):
        self.missing = missing
        super().__init__("short by " + str(missing))


class Account:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def check(self, amount):
        if amount < 1:
            raise InvalidAmount("amount must be positive")

    def deposit(self, amount):
        self.check(amount)
        self.balance = self.balance + amount

    def withdraw(self, amount):
        self.check(amount)
        if self.balance < amount:
            raise NotEnoughMoney(amount - self.balance)
        self.balance = self.balance - amount

    def __str__(self):
        return self.owner + ": " + str(self.balance)


acc = Account(input().strip())
ok = count = 0
line = input().strip()
while line != "end":
    count += 1
    action, value = line.split(" ")
    try:
        method = acc.deposit if action == "deposit" else acc.withdraw
        method(int(value))
    except NotEnoughMoney as e:
        print(line + ": " + str(e))
    except InvalidAmount as e:
        print(line + ": " + str(e))
    else:
        ok += 1
        print(line + ": ok")
    line = input().strip()
print(acc)
print("Done: " + str(ok) + "/" + str(count))
