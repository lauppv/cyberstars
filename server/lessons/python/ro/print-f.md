Stai, ce a fost asta?

```py
nume = "Quincy"
varsta = 32
inaltime = 1.97

print(f"Salut. Numele meu este {nume}, am {varsta} ani și am înălțimea de {inaltime}")
```

Ce e acel **print()** lung, care arată ca un script? Ei bine, mai întâi, hai să ne întrebăm cum am putea afișa valorile pentru **nume**, **varsta** și **inaltime** în interiorul unui text

Am putea face așa

```py
nume = "Quincy"
varsta = 32
inaltime = 1.90

print("Salut. Numele meu este ", nume, ", am ", varsta, " ani și am înălțimea de ", inaltime)
```

Problema e că, cu această abordare, trebuie să fii atent la spații, virgule și ghilimele… **fun fact**: am greșit de două ori când am scris asta **XD**

Credem că cea mai bună abordare este prima

```python
nume = "Cortez"
varsta = 57
inaltime = 1.67
print(f"Salut. Numele meu este {nume}, am {varsta} ani și am înălțimea de {inaltime}")
```

Evident, **nume**, **varsta** și **inaltime** sunt variabilele. Simbolurile **{}** funcționează ca un _placeholder_. În interiorul lor, dacă pui o variabilă, **numele variabilei va fi înlocuit cu valoarea ei**. Totuși, nu trebuie să uităm de **f**

```py
nume = "Quincy"
varsta = 32
inaltime = 1.90

print("Salut. Numele meu este {nume}, am {varsta} ani și am înălțimea de {inaltime}")
```

Acum **nu am pus acel f**. Ce se va afișa? Corect, exact șirul de caractere

```text
Salut. Numele meu este {nume}, am {varsta} ani și am înălțimea de {inaltime}
```

Și asta pentru că **f**-ul din fața șirului îi spune lui Python: „salut, înlocuiește ce e în {} cu valorile respective"
Acest proces în programare se numește **formatare** (de aici și litera **f**)

---

## Misiune: Raport de Zbor

Un pilot e pe cale să decoleze. Detaliile sunt stocate în `pilot`, `nume_nava`, `combustibil` și `viteza`.

Folosind **f-string-uri**, afișează un raport de zbor pe trei linii:

- numele pilotului și nava — de genul `Pilotul Shadow pilotează Orion`
- combustibilul — de genul `Combustibil: 400 unități`
- viteza — de genul `Viteză: 7.5 km/s`

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `pilot`, `nume_nava` — text
- `combustibil` — un număr întreg
- `viteza` — un număr cu zecimale

**Exemplu**

Cu valorile inițiale, programul tău ar trebui să afișeze

```text
Pilotul Shadow pilotează Orion
Combustibil: 400 unități
Viteză: 7.5 km/s
```
