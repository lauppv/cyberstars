Am folosit variabile peste tot: în interiorul buclelor, în interiorul funcțiilor, în afara funcțiilor. Dar te-ai întrebat vreodată — poate o variabilă creată **în interiorul** unei funcții să fie folosită **în afara** ei?

```py
def greet():
    mesaj = "Salut din Vice City"
    print(mesaj)

greet()
print(mesaj)
```

**Rulează** asta. Primul **print** funcționează (în interiorul funcției), dar al doilea se prăbușește cu o **NameError**: nume 'mesaj' is not defined

De ce? Pentru că **mesaj** a fost creat **în interiorul** funcției și există doar acolo. Odată ce funcția se termină, **mesaj** dispare. Asta se numește **scope** (domeniu de vizibilitate)

---

**Scope-ul** unei variabile este zona de cod în care ea există și poate fi folosită. În Python, există două scope-uri principale

**Scope local**: variabile create în interiorul unei funcții. Ele există doar în interiorul acelei funcții

```py
def f():
    x = 10
    print(x)

f()
# print(x) ar da eroare aici
```

**Scope global**: variabile create în afara oricărei funcții. Pot fi citite de oriunde

```py
nume = "Tommy Vercetti"

def greet():
    print(f"Salut, {nume}")

greet()
print(nume)
```

Ambele print-uri funcționează. **nume** a fost creat la nivelul cel mai de sus, așa că funcția îl poate **vedea**

---

Dar ce se întâmplă dacă încercăm să **schimbăm** o variabilă globală în interiorul unei funcții?

```py
health = 100

def takeDamage():
    health = health - 10
    print(health)

takeDamage()
```

**Rulează**-l. Eroare! Python vede **health = ...** în interiorul funcției și crede că creăm o **nouă variabilă locală** numită health. Dar în partea dreaptă folosim și **health**, iar cea locală nu există încă. Confuz? Da. De asta este important să înțelegi **scope-ul**

Regula simplă: dacă **atribui** o valoare unei variabile în interiorul unei funcții, Python o tratează ca fiind **locală**. Chiar dacă o variabilă globală are același nume

---

Soluția curată? **Transmite valori ca parametri și returnează rezultate**

```py
health = 100

def takeDamage(hp):
    hp = hp - 10
    return hp

health = takeDamage(health)
print(health)
```

Rezultatul **90**. Am transmis **health** în funcție, funcția și-a făcut treaba și a returnat noua valoare. Nicio confuzie legată de scope

Asta este cea mai bună practică: **funcțiile primesc date prin parametri și trimit date înapoi prin return**. Ele nu se întind să apuce variabile globale

---

Un exemplu rapid care arată că variabilele din **funcții diferite** sunt complet separate

```py
def f():
    x = 5
    print(x)

def g():
    x = 99
    print(x)

f()
g()
```

Rezultat

```text
5
99
```

Două variabile **x** diferite. Doar se întâmplă să aibă același nume, dar trăiesc în funcții diferite, așa că nu interferează una cu cealaltă

---

## Misiune: Boost de Scut

Scrie o funcție `boost(shield)` care **returnează** valoarea scutului dublată. Trebuie să lucreze doar cu **parametrul** ei și să **returneze** rezultatul — nu trebuie să se întindă către nicio variabilă globală (ăsta e tot rostul scope-ului).

Apoi, în programul principal:

1. Setează `shield = 100`
2. Afișează `Înainte: ` apoi shield
3. Apelează `boost(shield)` **fără a stoca** rezultatul, apoi afișează `Ignorat: ` apoi shield — observă că rămâne neschimbat, pentru că valoarea returnată a fost aruncată
4. Acum fă `shield = boost(shield)` și afișează `După: ` apoi shield

**Rezultat**

```text
Înainte: 100
Ignorat: 100
După: 200
```

Linia `Ignored` dovedește că funcția nu poate schimba variabila globală de la sine — noua valoare se păstrează doar când **stochezi valoarea returnată**.
