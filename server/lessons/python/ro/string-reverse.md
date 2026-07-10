Inversarea unui string sună simplu — și chiar este — dar este un exercițiu clasic pentru că te forțează să te gândești la **indexare**, **bucle** și **construirea treptată** a unui rezultat

Am văzut deja o metodă folosind pattern-ul de acumulator

```py
original = "Tommy"
sir_inversat = ""
for caracter in original:
    sir_inversat = caracter + sir_inversat
print(sir_inversat)
```

Rezultatul **ymmoT**

Dar Python are de fapt o metodă și mai simplă: **slicing-ul**

```py
nume = "Tommy"
print(nume[::-1])
```

Rezultatul **ymmoT**

Ce înseamnă **[::-1]**? Ține minte slicing-ul: **[start:stop:step]**. Când pasul este **-1**, Python merge **înapoi**. Lăsăm start și stop goale, așa că merge de la sfârșit la început. Este elegant, dar asigură-te că înțelegi mai întâi metoda manuală

---

Hai să încercăm o altă abordare: folosind o **buclă for cu indexuri**

```py
nume = "Tommy"
sir_inversat = ""
for i in range(len(nume) - 1, -1, -1):
    sir_inversat += nume[i]
print(sir_inversat)
```

Rezultatul **ymmoT**

**range(len(nume) - 1, -1, -1)** înseamnă: pornește de la ultimul index, coboară până la 0, cu pasul -1. Deci pentru "Tommy" (lungime 5), trecem prin indexurile 4, 3, 2, 1, 0

---

Dar inversarea **cuvintelor** dintr-o propoziție, nu a caracterelor individuale?

```py
propozitie = "I love Vice City"
cuvinte = propozitie.split(" ")
cuvinte_inversate = cuvinte[::-1]
rezultat = " ".join(cuvinte_inversate)
print(rezultat)
```

Rezultatul **City Vice love I**

**.join()** este opusul lui **.split()**. **" ".join(["a", "b", "c"])** ne dă **"a b c"**. Am despărțit după spațiu, am inversat lista și am lipit-o înapoi cu spații

---

## Misiune: Decodează Transmisiunea

Tocmai a sosit o transmisiune bruiată. Echipajul bănuiește că a fost trimisă **invers**, așa că trebuie să o întorci în două moduri și să vezi care are sens.

1. Scrie o funcție **inverseaza_text(text)** care returnează textul inversat **caracter cu caracter**, folosind o buclă (**nu folosi `[::-1]`**).
2. **Citește** transmisiunea, apoi afișează `Inversat: ` urmat de textul inversat caracter cu caracter.
3. Inversează de asemenea **ordinea cuvintelor** (desparte în cuvinte, inversează lista, lipește înapoi cu spații) și afișează `Ordine cuvinte: ` urmat de rezultat.

**Intrare:**

- transmisiunea, o linie de cuvinte separate prin spații

**Ieșire** — două linii: textul inversat caracter cu caracter, apoi textul cu ordinea cuvintelor inversată.

**Exemplu**

Dacă utilizatorul tastează

```text
navigation system online
```

programul ar trebui să afișeze

```text
Inversat: enilno metsys noitagivan
Ordine cuvinte: online system navigation
```
