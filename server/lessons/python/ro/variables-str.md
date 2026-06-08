Un concept fundamental în programare este stocarea informației. De cele mai multe ori, nu vrem doar să afișăm ceva pe ecran; vrem să-l **procesăm** mai întâi, să facem ceva cu el, și apoi poate să afișăm rezultatul

```py
print("Numele meu este Tommy Vercetti")
```

În lecția anterioară, am învățat că asta va afișa

```text
Numele meu este Tommy Vercetti
```

**print()** face exact asta. Totuși, nu ar fi mai organizat să **stocăm** numele undeva mai întâi și apoi să spunem ceva de genul **Numele meu este ...**, indiferent care este numele? De exemplu **Numele meu este Lance Vance** sau **Numele meu este Paul**. Cumva, nu contează care nume este, ceea ce contează este că îl putem afișa, **oricare** ar fi el

Ei bine, da, există o cale de a nu ne păsa de numele concret, ci doar de a-l afișa. Asta se numește **variabilă** în programare

```py
nume = "Tommy Vercetti"
print(nume)

nume = "Lance Vance"
print(nume)

nume = "Paul"
print(nume)
print(nume)
print(nume)
```

Dacă rulăm codul apăsând butonul Run Code, vom vedea că Paul apare de 3 ori, pentru că am folosit print(nume) de 3 ori.
Putem observa că nu ne pasă neapărat care este numele, pentru că se poate schimba — ceea ce contează este că îl putem afișa și folosi

Totuși, fii atent: dacă nu punem **""**, vom primi o eroare. Codul de mai jos nu va funcționa

```py
nume = Paul
print(nume)
```

De ce nu funcționează? Python crede că **Paul** este o variabilă. Dacă vrem să-i spunem că nu este o variabilă, ci **text**, trebuie să-l punem între **""**. Textul în programare se numește **string**

Un exemplu puțin mai avansat, dar care merită studiat, este:

```py
Kent = "Booooo"
nume = Kent
print(nume)
```

Am putea fi tentați să credem că se va afișa **Kent**, dar nu este adevărat. Se va afișa **Booooo** în schimb. De ce? Pentru că dacă nu punem **""**, Python crede că **Kent** este o variabilă și nu numele nostru. Vede **nume = Kent**, și cum Kent nu are "", caută o variabilă cu acel nume definită mai devreme și o înlocuiește cu **Booooo**.

```py
Kent = "Booooo"
nume = "Kent"
print(nume)
```

## Acest cod va afișa într-adevăr numele exact cum am intenționat. Rulează-l :)

Așadar, orice scriem între **" și "** se numește **string** și este folosit oricând vrem să scriem text pe care Python să-l trateze exact cum intenționăm, și **nu** ca pe o variabilă.

---

## Misiune: Echipajul Stației

Trei membri ai echipajului sunt repartizați la stație. Numele lor sunt stocate în variabilele `comandant`, `pilot` și `inginer` în partea de sus a codului tău.

Afișează cele trei nume, **fiecare pe linia lui**, în această ordine: comandant, pilot, inginer. Apoi pilotul este schimbat la mijlocul misiunii — adaugă o linie care schimbă `pilot` în `"Jess"` și afișează `pilot` încă o dată.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `comandant`, `pilot`, `inginer` — numele membrilor echipajului

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Shadow
Lance
Quincy
Jess
```
