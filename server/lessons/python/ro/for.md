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

## Mai multe despre range()

Până acum am dat lui **range()** două numere - de unde **începe** și unde se **oprește - 1**. Dar **range()** este mai flexibil de atât

Dacă îi dăm un **singur** număr, **Python** presupune că vrem să începem de la **0**

```py
for i in range(5):
    print(i)
```

Asta afișează **0, 1, 2, 3, 4** - adică **5** numere pornind de la **0**

Putem da și un **al treilea** număr, numit **pas**. El spune cu **cât** sărim de la o valoare la alta. De exemplu, dacă vrem doar numerele **pare** de la 0 la 10

```py
for i in range(0, 11, 2):
    print(i)
```

Asta afișează **0, 2, 4, 6, 8, 10**. În loc de **i = i + 1**, acum **for** face **i = i + 2** la fiecare pas

---

## Combinăm for cu variabile

Îți amintești de **variabile**? Le putem folosi împreună cu **for** ca să **strângem** un rezultat pe parcursul buclei

Să presupunem că vrem să **adunăm** toate numerele de la **1 la 5**. Avem nevoie de o variabilă în care să ținem **totalul**. O declarăm **înainte** de buclă, cu valoarea **0**, și o creștem la fiecare iterație

```py
total = 0
for i in range(1, 6):
    total = total + i
print(total)
```

Hai să urmărim ce se întâmplă:

- la început **total = 0**
- **i = 1** → **total = 0 + 1 = 1**
- **i = 2** → **total = 1 + 2 = 3**
- **i = 3** → **total = 3 + 3 = 6**
- **i = 4** → **total = 6 + 4 = 10**
- **i = 5** → **total = 10 + 5 = 15**

La final, **print(total)** afișează **15**

Foarte important: **print(total)** este **în afara** buclei (nu are spațiile din față). Dacă l-am pune **înăuntru**, am vedea totalul după **fiecare** pas, nu doar la sfârșit

```py
total = 0
for i in range(1, 6):
    total = total + i
    print(total)
```

Acum am mutat **print(total)** **în interiorul** buclei, așa că afișează totalul la fiecare iterație

```text
1
3
6
10
15
```

---

## Combinăm for cu if

Deja știm **if**. Ce se întâmplă dacă îl punem **în interiorul** unei bucle **for**? Atunci **Python** verifică condiția la **fiecare** iterație

De exemplu, vrem să afișăm doar numerele **pare** de la 1 la 10

```py
for i in range(1, 11):
    if i % 2 == 0:
        print(i)
```

La fiecare valoare a lui **i**, intrăm în buclă și verificăm **if i % 2 == 0** (adică „restul împărțirii la 2 este 0", deci numărul e par). Dacă da, îl afișăm. Dacă nu, sărim peste și mergem mai departe

Aceasta afișează **2, 4, 6, 8, 10**

Observă cele **două** niveluri de spațiere: **if** este indentat o dată (e în interiorul lui **for**), iar **print** este indentat de două ori (e în interiorul lui **if**)

---

## Misiune: Colectorul de Energie

Stația adună energie de la o serie de celule numerotate de la **1** la `celule`. Doar celulele cu număr **impar** funcționează — restul sunt defecte.

Fă-ți o variabilă pentru câte `celule` sunt (alege tu numele și valoarea), apoi scrie un program care:

- dacă sunt **0** celule → afișează `Fără celule`
- dacă este **1** celulă → afișează `O singură celulă`
- altfel → parcurge cu **for** numerele de la **1** la `celule`, **adună** doar numerele impare într-o variabilă `total` și afișează `total`

**Exemple**

Cu **6** celule, cele impare sunt **1, 3, 5**, deci programul afișează

```text
9
```

Cu **0** celule afișează

```text
Fără celule
```

Cu **1** celulă afișează

```text
O singură celulă
```
