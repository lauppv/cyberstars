Unele funcții sunt atât de mici încât să scriem `def`, un nume și `return` pare prea mult. Pentru ele Python are **lambda**: o funcție într-o singură linie scurtă, de multe ori fără nume

---

O lambda are cuvântul `lambda`, parametrii ei, două puncte și o singură expresie. Valoarea expresiei e ce returnează, fără cuvântul `return`

```py
dublu = lambda x: x * 2
print(dublu(5))

def dublu_si_asta(x):
    return x * 2
print(dublu_si_asta(5))
```

Rezultat

```text
10
10
```

Amândouă fac același lucru. O lambda nu poate avea mai multe linii, bucle sau blocuri `if`: doar o expresie

---

O lambda poate primi mai mulți parametri sau niciunul

```py
aduna = lambda a, b: a + b
salut = lambda: "salut"
print(aduna(2, 3))
print(salut())
```

Rezultat

```text
5
salut
```

---

Adevărata putere a unei lambda e că o putem da altei funcții, ca pe orice altă valoare. Aici `aplica_de_doua_ori` primește o funcție și o apelează de două ori

```py
def aplica_de_doua_ori(regula, valoare):
    return regula(regula(valoare))

print(aplica_de_doua_ori(lambda x: x + 10, 1))
print(aplica_de_doua_ori(lambda x: x * x, 3))
```

Rezultat

```text
21
81
```

`regula` e un parametru ca oricare altul, dar ce e în el e o funcție, așa că o putem apela: `regula(valoare)`. Scriem lambda chiar acolo unde avem nevoie de ea, fără să-i dăm întâi un nume

---

Singura expresie poate alege între două valori cu `if` și `else`, cum am văzut în lecția If/Else

```py
eticheta = lambda t: "cald" if t > 30 else "bine"
print(eticheta(35))
print(eticheta(20))
```

Rezultat

```text
cald
bine
```

Când logica are nevoie de mai mult, folosește `def`. O lambda e pentru cazurile scurte și clare

---

## Misiune: Regulile prețurilor

Magazinul stației își schimbă prețurile după reguli simple: jumătate de preț la reduceri, o taxă de livrare sau prețuri rotunjite în sus la următoarea zece. Magazinul vrea o singură funcție care aplică orice regulă pe fiecare preț

1. Scrie o funcție **schimba_tot(preturi, regula)** care returnează o listă nouă: `regula` aplicată pe fiecare preț, în aceeași ordine. Nu schimba lista pe care o primește
2. Începe programul cu două variabile: **preturi**, o listă de numere întregi, și **taxa**, un număr întreg. De exemplu `preturi = [23, 40, 7]` și `taxa = 5`
3. Afișează `Jumatate de pret: ` și prețurile tăiate în jumătate, rotunjite în jos la un număr întreg
4. Afișează `Cu taxa: ` și prețurile cu taxa adăugată
5. Afișează `Rotunjite: ` și fiecare preț rotunjit în sus la următoarea zece. Un preț care e deja o zece rămâne la fel
6. Afișează `Initiale: ` și lista de prețuri, ca să arăți că nu s-a schimbat

Pentru pașii 3-5, apelează `schimba_tot()` de fiecare dată cu o lambda. **preturi** are între 1 și 20 de prețuri, fiecare de la 0 la 1000, iar **taxa** e de la 0 la 100

**Exemplu** pentru preturi = [23, 40, 7] și taxa = 5

```text
Jumatate de pret: [11, 20, 3]
Cu taxa: [28, 45, 12]
Rotunjite: [30, 40, 10]
Initiale: [23, 40, 7]
```
