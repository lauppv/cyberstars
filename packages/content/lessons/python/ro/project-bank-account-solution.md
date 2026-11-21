```py
class EroareBanca(Exception):
    pass


class SumaInvalida(EroareBanca):
    pass


class BaniInsuficienti(EroareBanca):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa


class Cont:
    def __init__(self, titular):
        self.titular = titular
        self.sold = 0

    def depune(self, suma):
        if suma <= 0:
            raise SumaInvalida("suma trebuie sa fie pozitiva")
        self.sold += suma

    def retrage(self, suma):
        if suma <= 0:
            raise SumaInvalida("suma trebuie sa fie pozitiva")
        if suma > self.sold:
            raise BaniInsuficienti(suma - self.sold)
        self.sold -= suma

    def __str__(self):
        return f"{self.titular}: {self.sold}"


cont = Cont(input())
reusite = 0
total = 0
while True:
    linie = input()
    if linie == "end":
        break
    total += 1
    cuvant, numar = linie.split()
    try:
        if cuvant == "depune":
            cont.depune(int(numar))
        else:
            cont.retrage(int(numar))
    except EroareBanca as e:
        print(f"{linie}: {e}")
    else:
        reusite += 1
        print(f"{linie}: ok")

print(cont)
print(f"Reusite: {reusite}/{total}")
```
