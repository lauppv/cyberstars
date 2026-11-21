Jocurile, quiz-urile și testele au nevoie de numere pe care nu le putem ghici: o aruncare de zar, o întrebare la întâmplare, un pachet amestecat. Modulul `random` le face

---

`random.randint(a, b)` dă un număr întreg de la `a` la `b`, amândouă incluse. `random.choice()` alege un element dintr-o listă. Rulează celula de câteva ori: rezultatele se schimbă de fiecare dată

```py
import random

print(random.randint(1, 6))
print(random.choice(["piatra", "hartie", "foarfeca"]))
```

---

`random.shuffle()` amestecă o listă pe loc, ca pe un pachet de cărți. Schimbă lista însăși și nu dă nimic înapoi. `random.sample()` alege câteva elemente diferite și lasă lista în pace

```py
import random

pachet = ["A", "K", "Q", "J"]
random.shuffle(pachet)
print(pachet)
print(random.sample(range(1, 50), 3))
```

`random.random()` dă un număr cu punct, de la 0 până aproape de 1, dar niciodată 1. E util pentru șanse: `random.random() < 0.3` e True cam de 3 ori din 10

---

Numerele nu sunt cu adevărat la întâmplare. Python le face cu o formulă, pornind de la un număr numit **seed** (sămânță). De obicei seed-ul vine de la ceas, deci e altul la fiecare rulare. Dar îl putem fixa cu `random.seed()`, iar atunci același program dă aceleași numere de fiecare dată

```py
import random

random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))
random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))
```

Rezultat

```text
6 1 1
6 1 1
```

Rulează-l de câte ori vrei: cu seed-ul 42, aceste trei aruncări sunt mereu 6, 1 și 1. Așa repetă jocurile un nivel exact la fel și așa pot testele să verifice un program care folosește numere la întâmplare

---

Un seed fix dă aceleași numere doar când programul cere în același fel, în aceeași ordine. Fiecare apel ia următorul număr din formulă, așa că un apel în plus sau în minus, sau altă funcție, schimbă tot ce vine după

```py
import random

random.seed(7)
echipaj = ["Ada", "Alan", "Grace", "Kai"]
print(random.choice(echipaj))
random.shuffle(echipaj)
print(echipaj)
```

Rezultat

```text
Grace
['Grace', 'Ada', 'Kai', 'Alan']
```

---

## Misiune: Tragerea la sorți

În fiecare săptămână stația trage la sorți: cine face curat în bucătărie, în ce ordine mănâncă echipajul și câte puncte bonus primește câștigătorul. Tragerea trebuie să fie corectă, dar căpitanul vrea să o poată verifica mai târziu, așa că pornește mereu de la un seed

1. Începe programul cu două variabile: **seed**, un număr întreg, și **echipaj**, o listă de nume. De exemplu `seed = 3` și `echipaj = ["Ada", "Ben", "Cy", "Dee"]`
2. Fixează seed-ul cu `random.seed(seed)`. Apoi fă aceste trei trageri, în ordinea asta, fiecare cu un singur apel:
   - fă o copie a listei și amestec-o cu `random.shuffle()`
   - alege persoana care face curat cu `random.choice()` din lista inițială
   - aruncă punctele bonus cu `random.randint(1, 6)`
3. Afișează `Ordine: ` și copia amestecată, unită cu `, `
4. Afișează `Curatenie: ` și persoana care face curat
5. Afișează `Bonus: ` și punctele bonus
6. Afișează `Lista: ` și lista inițială unită cu `, `, ca să arăți că nu s-a schimbat

**seed** e de la 0 la 1000, iar **echipaj** are între 1 și 10 nume

**Exemplu** pentru seed = 3 și echipaj = ["Ada", "Ben", "Cy", "Dee"]

```text
Ordine: Dee, Ada, Cy, Ben
Curatenie: Cy
Bonus: 5
Lista: Ada, Ben, Cy, Dee
```
