class BankError(Exception):
    pass


class InvalidAmount(BankError):
    pass


class NotEnoughMoney(BankError):
    def __init__(self, missing):
        super().__init__(f"short by {missing}")
        self.missing = missing


class Account:
    def __init__(self, owner):
        self.owner, self.balance = owner, 0

    def deposit(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        self.balance -= amount
        if self.balance < 0:
            raise NotEnoughMoney(-self.balance)

    def __str__(self):
        return f"{self.owner}: {self.balance}"


acc = Account(input())
ok = total = 0
while (line := input()) != "end":
    total += 1
    w, n = line.split()
    try:
        (acc.deposit if w == "deposit" else acc.withdraw)(int(n))
    except BankError as e:
        print(f"{line}: {e}")
    else:
        ok += 1
        print(f"{line}: ok")
print(acc)
print(f"Done: {ok}/{total}")
