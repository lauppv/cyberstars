În lecția Try / Except am cunoscut `try` și `except`. Un `try` mai poate avea două blocuri: `else`, pentru codul care trebuie să ruleze doar când nu a mers nimic prost, și `finally`, pentru codul care trebuie să ruleze orice ar fi

---

`else` vine după blocurile `except`. Rulează doar când blocul `try` s-a terminat fără eroare

```py
for text in ["42", "abc"]:
    try:
        numar = int(text)
    except ValueError:
        print(text, "nu e un numar")
    else:
        print(text, "dublat e", numar * 2)
```

Rezultat

```text
42 dublat e 84
abc nu e un numar
```

De ce să nu punem dublarea în `try`? Atunci o eroare din dublare ar fi prinsă și ea, ca și cum ar fi un număr greșit. Cu `else`, `try` ține doar linia care ne așteptăm să dea greș, așa că prindem doar acea eroare

---

`finally` vine ultimul. Rulează de fiecare dată: după un succes, după o eroare prinsă și chiar când o eroare nu e prinsă deloc

```py
def citeste_numar(text):
    try:
        return int(text)
    except ValueError:
        return 0
    finally:
        print("verificat", text)

print(citeste_numar("7"))
print(citeste_numar("x"))
```

Rezultat

```text
verificat 7
7
verificat x
0
```

`finally` rulează chiar dacă funcția se întoarce din `try` sau `except`: Python îl rulează la ieșire, înainte ca valoarea să plece înapoi

---

De asta `finally` e locul pentru curățenie: să închidem ceva, să oprim ceva, să notăm că o treabă s-a terminat

```py
lumina_aprinsa = False
try:
    lumina_aprinsa = True
    print("lucram in camera intunecata")
    int("hopa")
except ValueError:
    print("ceva a mers prost")
finally:
    lumina_aprinsa = False
    print("lumina stinsa")
print(lumina_aprinsa)
```

Rezultat

```text
lucram in camera intunecata
ceva a mers prost
lumina stinsa
False
```

Un bloc `with`, pe care l-am cunoscut la fișiere, face acest fel de curățenie pentru noi. `finally` e pentru cazurile în care nu există un `with`

---

Toate patru împreună, în ordinea asta: `try`, `except`, `else`, `finally`

```py
for text in ["5", "cinci"]:
    try:
        valoare = int(text)
    except ValueError:
        print("gresit:", text)
    else:
        print("bun:", valoare)
    finally:
        print("urmatorul")
```

Rezultat

```text
bun: 5
urmatorul
gresit: cinci
urmatorul
```

---

## Misiune: Importul citirilor

Citirile vin de la senzori ca text. Unele sunt stricate. Stația le importă una câte una și, după fiecare, bună sau proastă, notează că textul a fost verificat

1. Scrie o funcție **importa_citire(text, citiri, verificate)** cu un `try` care doar transformă textul într-un număr întreg. La un `ValueError`, afișează `sarit` și textul cum îl arată `repr()`, între ghilimele. În `else`, adaugă numărul în lista `citiri` și afișează `salvat` și numărul. În `finally`, adaugă textul în lista `verificate`, de fiecare dată
2. Începe programul cu o variabilă **texte**, o listă de string-uri. De exemplu `texte = ["21", "x7", "-3", ""]`
3. Fă două liste goale și apelează `importa_citire()` pentru fiecare text
4. Afișează `Salvate: ` și lista citirilor, și `Verificate: ` și câte texte au fost verificate

**texte** are între 1 și 10 texte. Un text bun e un număr întreg, poate cu un `-`

**Exemplu** pentru valorile de mai sus

```text
salvat 21
sarit 'x7'
salvat -3
sarit ''
Salvate: [21, -3]
Verificate: 4
```
