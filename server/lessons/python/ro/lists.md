Până acum, fiecare variabilă conținea **un singur** lucru: un nume, un număr, un boolean. Dar dacă vreau să stochez numele tuturor personajelor din **GTA Vice City**?

Aș putea face asta

```py
nume1 = "Tommy Vercetti"
nume2 = "Lance Vance"
nume3 = "Cortez"
nume4 = "Phil Cassidy"
nume5 = "Sonny Forelli"
```

Urât. Și dacă aș vrea **100** de nume? **1000**? Nici vorbă. Trebuie să existe o soluție mai bună

Există. Se numește **listă**

```py
nume = ["Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy", "Sonny Forelli"]
print(nume)
```

O **listă** este o **colecție** de valori stocate într-o singură variabilă. Folosim parantezele drepte **[ ]** și separăm elementele cu **virgule**

Dacă rulăm asta, **Python** va afișa toată lista deodată

```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy', 'Sonny Forelli']
```

---

Putem accesa și **un singur element** al listei, exact cum am făcut cu șirurile de caractere: prin **index**

```py
nume = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(nume[0])    # Tommy Vercetti
print(nume[1])    # Lance Vance
print(nume[2])    # Cortez
```

Încă o dată, **numărarea începe de la 0**. Primul element este **nume[0]**, NU **nume[1]**

Ce se întâmplă dacă cerem un index care nu există?

```py
nume = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(nume[10])
```

**Rulează**-l. Vei vedea că **Python** se plânge cu un **IndexError**, pentru că nu există niciun element la poziția **10**. Citește-ți mereu erorile :)

---

Câte elemente are o listă? **len()** din nou

```py
nume = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(len(nume))   # 3
```

Același **len()** pe care l-am folosit pe șiruri. **Python** este isteț în privința asta

---

Putem **adăuga** elemente noi într-o listă cu **.append()**

```py
nume = ["Tommy Vercetti", "Lance Vance"]
nume.append("Cortez")
nume.append("Phil Cassidy")
print(nume)
```

Rezultat

```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy']
```

**.append()** adaugă noul element **la sfârșitul** listei. Lista s-a **modificat**, asta este diferit de **upper()** și **lower()** pe șiruri, care returnau un șir nou. Listele sunt modificate **pe loc**

---

Putem și **schimba** o valoare la un anumit index

```py
nume = ["Tommy Vercetti", "Lance Vance", "Cortez"]
nume[1] = "Lance Vance Dance"
print(nume)
```

Rezultat

```text
['Tommy Vercetti', 'Lance Vance Dance', 'Cortez']
```

---

Listele pot conține orice fel de valori, nu doar șiruri

```py
varste = [42, 35, 60, 29]
preturi = [3.14, 9.99, 12.50]
fanioane = [True, False, True]
```

Le putem chiar amesteca, dar în practică este rar și de obicei un semn că ceva e greșit la design

---

## Misiune: Cala de Marfă

Stația își ține evidența mărfii într-o listă. Pornești cu o **listă goală** `cargo` (deja în dreapta). Fă următoarele, în ordine:

1. **Adaugă** `oxigen`, `water`, `food` și `combustibil` folosind **.append()**
2. Afișează câte articole sunt încărcate (folosește **len()**)
3. Afișează **primul** articol
4. Afișează **ultimul** articol
5. O scurgere strică apa — **înlocuiește** articolul de la indexul 1 cu `EMPTY`
6. Afișează **toată lista**

**Rezultat**

```text
4
oxygen
fuel
['oxygen', 'EMPTY', 'food', 'fuel']
```

Observă ultima linie: când afișezi o listă întreagă, Python îți pune parantezele și ghilimelele de la sine. Adaugă mai multă marfă și rulează din nou ca să vezi cum se schimbă numerele :)
