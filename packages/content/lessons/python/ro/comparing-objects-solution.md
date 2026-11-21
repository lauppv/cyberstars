```py
class Versiune:
    def __init__(self, text):
        self.text = text
        self.parti = tuple(int(parte) for parte in text.split("."))

    def __str__(self):
        return self.text

    def __eq__(self, other):
        return self.parti == other.parti

    def __lt__(self, other):
        return self.parti < other.parti


versiuni = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]
curenta = "1.10.2"

ordonate = sorted(Versiune(v) for v in versiuni)
print(" < ".join(str(v) for v in ordonate))
cea_mai_noua = ordonate[-1]
print(f"Cea mai noua: {cea_mai_noua}")
print(f"La zi: {'da' if Versiune(curenta) == cea_mai_noua else 'nu'}")
```
