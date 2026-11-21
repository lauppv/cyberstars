```py
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
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise InvalidAmount("amount must be positive")
        if amount > self.balance:
            raise NotEnoughMoney(amount - self.balance)
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}: {self.balance}"


account = Account(input())
done = 0
total = 0
while True:
    line = input()
    if line == "end":
        break
    total += 1
    word, number = line.split()
    try:
        if word == "deposit":
            account.deposit(int(number))
        else:
            account.withdraw(int(number))
    except BankError as e:
        print(f"{line}: {e}")
    else:
        done += 1
        print(f"{line}: ok")

print(account)
print(f"Done: {done}/{total}")
```
