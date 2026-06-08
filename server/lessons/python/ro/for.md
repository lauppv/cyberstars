Bun venit la probabil una dintre cele **mai importante** lecții pe care le putem învăța în lumea programării - bucla **for**

De ce este importantă? Să presupunem că vrem să afișăm toate numerele de la 0 la 10

Am putea face așa

```py
print("1")
print("2")
print("3")
print("4")
print("5")
print("6")
print("7")
print("8")
print("9")
print("10")
```

E clar că am **repetat** codul, iar asta este complet **interzis**. De ce? Ei bine, ce se întâmplă dacă vrem să afișăm toate numerele de la **1 la 1000**? În niciun caz nu vrem **1000 de instrucțiuni print()** pe care să le modificăm manual

Aici intervine puterea buclei **for**

```py
i = 1
for i in range(1, 1000):
    print(i)
```

Aceasta va afișa toate numerele de la **1 la 999**. De ce nu include **1000**? **range()** este o **funcție** care există deja în **Python** și ne spune de unde vrem să **începem** și unde vrem să ne **oprim - 1**. Adică, **range(1, 1000)** înseamnă de la **1 la 999**. Dacă vrem de la **1 la 1000**, putem spune **range(1, 1001)**

```py
i = 1
for i in range(1, 1001):
    print(i)
```

Acum vedem toate numerele de la **1 la 1000**

Hai să explicăm acest cod

**i = 1**

**for** se uită la **i** și verifică variabila i de mai înainte. Știe că **i = 1**, așa că pornește de acolo. Apoi **for** se uită mai departe și vede **range(1, 1001)**. Știe că asta înseamnă **toate numerele de la 1 la 1000 (1001 - 1)**, așa că ia **i** și la fiecare iterație îl mărește cu **1**, ca **i = i + 1**

Mai întâi, **i = 1**, apoi intră în bloc și îl afișează, după care **automat face i = i + 1**

Acum **i = 2**, îl afișează, apoi din nou face **i = i + 1**

Acum **i = 3**, îl afișează, apoi face din nou **i = i + 1**

... și tot așa **:)**. Nu e fascinant? Practic facem calculatorul să facă această **repetiție** pentru noi

**in** este un cuvânt cheie. Îi spune lui **Python** să ia variabila **i** și să o verifice cu **range()**

---

## Misiune: Încălzirea Reactorului

Reactorul stației se încălzește câte un **pas** o dată înainte să intre online. Ți se dă câți `pasi` durează încălzirea și un `pas_amplificare` special unde inginerii declanșează un impuls de putere.

Scrie un program care folosește o buclă **for** ca să parcurgă fiecare număr de pas de la **1** la `pasi`. Pentru fiecare pas, afișează:

- dacă pasul este `pas_amplificare` → afișează `Pas`, apoi numărul pasului, apoi `: BOOST` (pentru `boostStep = 3` asta înseamnă `Pas 3: BOOST`)
- altfel, dacă este **primul** pas → `Aprindere`
- altfel, dacă este **ultimul** pas → `Reactor online`
- altfel → afișează `Pas`, apoi numărul pasului, apoi `: încălzire` (de exemplu `Pas 2: încălzire`)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `pasi` — câți pași de încălzire sunt
- `pas_amplificare` — pasul la care are loc impulsul

**Exemplu**

Cu `steps = 5` și `boostStep = 3`, programul tău ar trebui să afișeze

```text
Aprindere
Pas 2: încălzire
Pas 3: BOOST
Pas 4: încălzire
Reactor online
```

Acum schimbă la `steps = 3` și `boostStep = 2` și rulează din nou — rezultatul ar trebui să devină

```text
Aprindere
Pas 2: BOOST
Reactor online
```
