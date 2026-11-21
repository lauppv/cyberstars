În acest ultim proiect construim catalogul școlii stației: notele fiecărui elev vin una câte una, iar programul afișează un tabel îngrijit, calificativele și cel mai bun elev la fiecare materie. Pune împreună clasele, dicționarele, sortarea cu key, formatele și `Counter`

---

Fiecare elev e un obiect care ține un dicționar de note, câte una pe materie. O notă dată din nou pentru aceeași materie o înlocuiește pe cea veche

```py
class Elev:
    def __init__(self, nume):
        self.nume = nume
        self.note = {}

    def adauga(self, materie, nota):
        self.note[materie] = nota

    def media(self):
        return sum(self.note.values()) / len(self.note)

ada = Elev("Ada")
ada.adauga("mate", 80)
ada.adauga("desen", 95)
ada.adauga("mate", 90)
print(ada.note, ada.media())
```

Rezultat

```text
{'mate': 90, 'desen': 95} 92.5
```

---

Calificativul vine din medie. Verificând de sus în jos, prima regulă care se potrivește câștigă

```py
def calificativ(media):
    if media >= 90:
        return "A"
    if media >= 80:
        return "B"
    if media >= 70:
        return "C"
    if media >= 60:
        return "D"
    return "F"

print(calificativ(92.5), calificativ(79.9), calificativ(12))
```

Rezultat

```text
A C F
```

---

Elevii vin în orice ordine, așa că un dicționar de la nume la obiecte îl găsește repede pe fiecare. Un nume văzut prima oară face un `Elev` nou

```py
class Elev:
    def __init__(self, nume):
        self.nume = nume
        self.note = {}

elevi = {}
for nume in ["Ada", "Ben", "Ada"]:
    if nume not in elevi:
        elevi[nume] = Elev(nume)
print(list(elevi))
```

Rezultat

```text
['Ada', 'Ben']
```

---

Tabelul e sortat după medie, cel mai bun primul. Un minus în fața unui număr din key îi întoarce ordinea, așa că numele pot merge tot de la A la Z la egalitate. Formatele aliniază coloanele

```py
randuri = [("Ben", 81.25), ("Ada", 92.5), ("Cy", 81.25)]
for nume, media in sorted(randuri, key=lambda r: (-r[1], r[0])):
    print(f"{nume:<6}{media:>6.1f}")
```

Rezultat

```text
Ada     92.5
Ben     81.2
Cy      81.2
```

`81.25` apare ca `81.2`: Python rotunjește un număr aflat exact la jumătate spre cifra pară, cât timp numărul e păstrat exact, iar 81.25 este

---

## Misiune: Catalogul

Scrie catalogul și afișează-l pentru notele introduse

1. Scrie o clasă **Elev** cu `__init__(nume)`, o metodă **adauga(materie, nota)**, o metodă **media()** și o metodă **calificativ()** care returnează litera pentru medie, ca mai sus
2. Citește linii până la una care spune `end`. Fiecare linie e numele unui elev, o materie și o notă întreagă, ca `Ada mate 92`
3. Afișează o linie pentru fiecare elev, de la cea mai bună medie la cea mai slabă, la egalitate în ordinea numelor: numele într-o coloană lată de 8 caractere la stânga, media cu o zecimală într-o coloană lată de 6 la dreapta, două spații și calificativul
4. Afișează `Calificative: ` și, pentru fiecare calificativ de la A la F pe care l-a primit vreun elev, litera, un spațiu și câți elevi l-au primit, unite cu `, `. Numără-le cu `Counter`
5. Pentru fiecare materie, în ordinea numelor, afișează `Cel mai bun la `, materia, `: ` și elevul cu cea mai bună notă la ea, la egalitate primul în ordinea numelor

Numele și materiile sunt dintr-un cuvânt. Notele sunt de la 0 la 100 și sunt între 1 și 30 de linii înainte de `end`

**Intrare**

```text
Ada mate 92
Ben mate 75
Ada desen 88
Cy desen 95
Ben desen 88
Ada mate 70
end
```

**Rezultat**

```text
Cy        95.0  A
Ben       81.5  B
Ada       79.0  C
Calificative: A 1, B 1, C 1
Cel mai bun la desen: Cy
Cel mai bun la mate: Ben
```

A doua notă a Adei la mate, 70, o înlocuiește pe 92, așa că Ben e cel mai bun la mate
