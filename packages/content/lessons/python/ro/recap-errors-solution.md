```py
class EroareEcluza(Exception):
    pass


class EroarePresiune(EroareEcluza):
    def __init__(self, presiune):
        super().__init__(f"presiunea {presiune} in afara limitelor")
        self.presiune = presiune


def deschide_ecluza(text):
    presiune = int(text)
    if presiune < 90 or presiune > 110:
        raise EroarePresiune(presiune)
    return "deschisa"


citiri = ["100", "85", "abc", "110"]

deschideri = 0
verificari = 0
departe = None
for citire in citiri:
    try:
        rezultat = deschide_ecluza(citire)
    except EroarePresiune as e:
        print(f"{citire}: {e}")
        if departe is None or abs(e.presiune - 100) > abs(departe - 100):
            departe = e.presiune
    except ValueError:
        print(f"{citire}: nu e un numar")
    else:
        deschideri += 1
        print(f"{citire}: {rezultat}")
    finally:
        verificari += 1

print(f"Deschideri: {deschideri}")
print(f"Verificari: {verificari}")
print(f"Cea mai departe: {'niciuna' if departe is None else departe}")
```
