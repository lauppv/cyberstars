O clasă copil primește metodele părintelui. Dar uneori un copil trebuie să facă aceeași treabă în felul lui. Când scrie o metodă cu același nume ca a părintelui, varianta lui câștigă pentru obiectele lui. Asta se numește **suprascriere**

---

Aici orice alarmă poate scoate un sunet, dar o alarmă de incendiu scoate altul

```py
class Alarma:
    def sunet(self):
        return "bip"

class AlarmaIncendiu(Alarma):
    def sunet(self):
        return "UI-UU UI-UU"

print(Alarma().sunet())
print(AlarmaIncendiu().sunet())
```

Rezultat

```text
bip
UI-UU UI-UU
```

Python caută o metodă întâi în clasa obiectului, apoi în părinte. O `AlarmaIncendiu` găsește `sunet` în clasa ei, așa că nu mai ajunge niciodată la cea a părintelui

---

Varianta copilului poate și să construiască peste cea a părintelui, cu `super()`, în loc să o înlocuiască de tot

```py
class Alarma:
    def __init__(self, loc):
        self.loc = loc

    def mesaj(self):
        return f"Alarma in {self.loc}"

class AlarmaIncendiu(Alarma):
    def mesaj(self):
        return super().mesaj() + ": incendiu, iesiti acum"

print(AlarmaIncendiu("Laborator").mesaj())
```

Rezultat

```text
Alarma in Laborator: incendiu, iesiti acum
```

Dacă mesajul părintelui se schimbă mai târziu, alarma de incendiu îl urmează, pentru că nu a copiat niciodată cuvintele părintelui

---

Partea cea mai bună: codul care folosește alarmele nu trebuie să știe ce fel are. Apelează `mesaj()`, iar fiecare obiect răspunde în felul lui

```py
class Alarma:
    def __init__(self, loc):
        self.loc = loc

    def mesaj(self):
        return f"Alarma in {self.loc}"

class AlarmaIncendiu(Alarma):
    def mesaj(self):
        return super().mesaj() + ": incendiu, iesiti acum"

class AlarmaUsa(Alarma):
    def mesaj(self):
        return f"Usa deschisa in {self.loc}"

for alarma in [Alarma("Doc"), AlarmaIncendiu("Laborator"), AlarmaUsa("Sala de sport")]:
    print(alarma.mesaj())
```

Rezultat

```text
Alarma in Doc
Alarma in Laborator: incendiu, iesiti acum
Usa deschisa in Sala de sport
```

Bucla nu are niciun `if` despre feluri. Dacă adăugăm mai târziu un fel nou de alarmă, avem nevoie de o clasă nouă, nu de o schimbare în buclă

---

Și `__str__` și `__init__` pot fi suprascrise, la fel. Asta am făcut cu `__init__` și `super()` în lecția trecută

---

## Misiune: Panoul de alarme

Panoul de alarme al stației arată câte o linie pentru fiecare alarmă. Fiecare fel de alarmă își scrie linia în felul lui

1. Scrie o clasă **Alarma** cu un `__init__` care primește un `loc` și o metodă **mesaj()** care returnează `Alarma in loc`
2. Scrie o clasă **AlarmaIncendiu** care moștenește din `Alarma` și suprascrie **mesaj()**: returnează mesajul părintelui cu `: incendiu, iesiti acum` adăugat, folosind `super()`
3. Scrie o clasă **AlarmaUsa** care moștenește din `Alarma` și suprascrie **mesaj()**: returnează `Usa deschisa in loc`
4. Începe programul cu două variabile: **locuri** și **feluri**, două liste de string-uri în aceeași ordine. Un fel e `incendiu`, `usa` sau `simpla`. De exemplu `locuri = ["Doc", "Laborator", "Sala de sport"]` și `feluri = ["simpla", "incendiu", "usa"]`
5. Fă felul potrivit de alarmă pentru fiecare loc, păstrează-le într-o listă și afișează mesajul fiecăreia cu o singură buclă care nu are niciun `if` despre feluri
6. Afișează `Alarme de incendiu: ` și câte alarme de incendiu sunt

Listele au între 1 și 10 alarme

**Exemplu** pentru valorile de mai sus

```text
Alarma in Doc
Alarma in Laborator: incendiu, iesiti acum
Usa deschisa in Sala de sport
Alarme de incendiu: 1
```
