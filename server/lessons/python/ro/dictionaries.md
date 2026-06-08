Până acum am stocat valori în variabile și în liste. O **listă** este grozavă când avem o grămadă de valori și le accesăm după **poziția** lor (index 0, 1, 2, …). Dar ce ne facem dacă nu ne pasă de poziție și în schimb ne pasă de un **nume**?

Imaginează-ți agenda telefonică a lui Tommy Vercetti. El nu spune „dă-mi contactul numărul 3". El spune „dă-mi numărul de telefon al lui **Cortez**". **Numele** este modul în care caută lucrurile

Exact asta face un **dicționar** în Python

```py
agenda_telefonica = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(agenda_telefonica["Cortez"])
```

Afișează **555-1234**

Un dicționar se creează cu **acolade {}**. Înăuntru, scriem perechi **key: value (cheie: valoare)** separate prin **virgule**. **Cheia** este ceea ce folosim ca să căutăm lucrurile (cum ar fi numele), iar **valoarea** este ceea ce primim înapoi (cum ar fi numărul de telefon)

```py
agenda_telefonica = {
    "Cortez": "555-1234",
    "Lance": "555-5678",
    "Phil": "555-9999"
}

print(agenda_telefonica["Lance"])
print(agenda_telefonica["Phil"])
```

Afișează

```text
555-5678
555-9999
```

---

Ce se întâmplă dacă cerem o cheie care nu există?

```py
agenda_telefonica = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

print(agenda_telefonica["Sonny"])
```

**Rulează**. Vei vedea o **KeyError**. Python ne spune: „nu cunosc niciun Sonny". Citește mereu eroarea :)

---

Putem **adăuga** o intrare nouă sau **modifica** una existentă foarte ușor

```py
agenda_telefonica = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

agenda_telefonica["Tommy"] = "555-0000"
print(agenda_telefonica["Tommy"])

agenda_telefonica["Lance"] = "555-1111"
print(agenda_telefonica["Lance"])
```

Afișează

```text
555-0000
555-1111
```

Dacă cheia nu există, Python o **creează**. Dacă există deja, Python o **actualizează**. Simplu

---

Putem și **elimina** o intrare cu **del**

```py
agenda_telefonica = {
    "Cortez": "555-1234",
    "Lance": "555-5678"
}

del agenda_telefonica["Lance"]
print(agenda_telefonica)
```

Afișează

```text
{'Cortez': '555-1234'}
```

Lance a dispărut. Scuze, Lance :)

---

Ca să verificăm dacă o cheie **există** înainte să o accesăm, folosim **in**

```py
agenda_telefonica = {"Cortez": "555-1234"}

if "Cortez" in agenda_telefonica:
    print("L-am găsit pe Cortez!")
else:
    print("Cortez nu este în agendă")
```

---

La fel ca listele, dicționarele pot conține **orice tip** de valoare: șiruri de caractere, numere, valori booleene, chiar și alte liste sau dicționare

```py
jucator = {
    "nume": "Tommy Vercetti",
    "viata": 100,
    "este_viu": True,
    "arme": ["bat", "pistol", "shotgun"]
}

print(jucator["nume"])
print(jucator["viata"])
print(jucator["arme"])
```

---

## Misiune: Baza de Date a Echipajului

Stația păstrează fiecare membru al echipajului într-un dicționar. Pornești cu acesta (deja în dreapta):

```python
echipaj = {"nume": "Tommy", "role": "Pilot", "varsta": 34}
```

Fă următoarele, în ordine:

1. **Adaugă** o cheie nouă `station` cu valoarea `Laniakea`
2. E ziua de naștere a lui Tommy — **actualizează** `varsta` la `35`
3. Afișează valorile pentru `nume`, `role`, `varsta` și `station`, fiecare pe propria linie
4. Încă nu urmărim rangul — dacă cheia `rank` **nu este în** dicționar, afișează `Rang: necunoscut`

**Output**

```text
Tommy
Pilot
35
Laniakea
Rang: necunoscut
```
