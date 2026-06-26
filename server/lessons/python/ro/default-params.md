Am învățat că funcțiile primesc **parametri**. Dar uneori, de cele mai multe ori un parametru are **aceeași valoare**, și doar ocazional vrem să-l schimbăm. Ar fi enervant să-l transmitem de fiecare dată

De exemplu, imaginează-ți o funcție care creează un profil de jucător

```py
def creaza_jucator(nume, viata, oras):
    print(f"{nume} | HP: {viata} | City: {oras}")

creaza_jucator("Tommy", 100, "Vice City")
creaza_jucator("Lance", 100, "Vice City")
creaza_jucator("Cortez", 100, "Vice City")
creaza_jucator("Phil", 50, "Vice City")
```

Am scris **100** și **"Vice City"** de trei ori din patru. E multă repetiție. Ce-ar fi dacă am putea spune „viata este 100 **în mod implicit** și oras este Vice City **în mod implicit**, dacă nu spun altfel"?

```py
def creaza_jucator(nume, viata=100, oras="Vice City"):
    print(f"{nume} | HP: {viata} | City: {oras}")

creaza_jucator("Tommy")
creaza_jucator("Lance")
creaza_jucator("Phil", 50)
creaza_jucator("Cortez", 100, "San Andreas")
```

Afișează

```text
Tommy | HP: 100 | City: Vice City
Lance | HP: 100 | City: Vice City
Phil | HP: 50 | City: Vice City
Cortez | HP: 100 | City: San Andreas
```

**viata=100** și **oras="Vice City"** sunt **valori implicite**. Dacă nu transmitem nimic pentru acei parametri, Python folosește valorile implicite. Dacă **transmitem** ceva, aceasta înlocuiește valoarea implicită

---

**Regulă importantă**: parametrii cu valori implicite trebuie să vină **după** parametrii fără valori implicite

```py
def f(a, b=10, c=20):
    print(a, b, c)
```

Asta e în regulă. **a** nu are valoare implicită, **b** și **c** au

```py
def f(a=10, b, c):
    print(a, b, c)
```

**Rulează** asta. Python ne dă o **SyntaxError**. Nu poți pune un parametru fără valoare implicită **după** unul care are valoare implicită. Gândește-te — Python nu ar ști care valoare aparține cărui parametru

---

Putem folosi și **argumente cu nume (keyword arguments)** ca să sărim peste parametri

```py
def creaza_jucator(nume, viata=100, oras="Vice City"):
    print(f"{nume} | HP: {viata} | City: {oras}")

creaza_jucator("Tommy", oras="Liberty City")
```

Afișează **Tommy | HP: 100 | City: Liberty City**

Am sărit peste **viata** (am păstrat valoarea implicită 100) și am schimbat doar **oras** folosind **numele** lui. Fără argumente cu nume, ar trebui să scriem **creaza_jucator("Tommy", 100, "Liberty City")** — transmițând 100 deși este valoarea implicită

---

## Misiune: Jurnal de Andocare

Scrie o funcție `andocheaza(nava, bay="A1", prioritate="normal")` care afișează `nava andocat la bay (prioritate)`. Parametrii `bay` și `prioritate` au **valori implicite**, deci pot fi omiși.

Apeleaz-o exact așa (apelurile sunt deja în starter):

```py
andocheaza("Voyager")
andocheaza("Odyssey", "B7")
andocheaza("Pioneer", prioritate="urgent")
```

Observă că ultimul apel folosește un **argument cu nume** (`prioritate="urgent"`) ca să sară peste `bay` și să-i păstreze valoarea implicită în timp ce setează totuși prioritatea.

**Ieșire**

```text
Voyager andocat la A1 (normal)
Odyssey andocat la B7 (normal)
Pioneer andocat la A1 (urgent)
```
