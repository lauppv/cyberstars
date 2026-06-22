În lecția anterioară am văzut că putem lua decizii în cod la fel cum facem în viața reală

Totuși, cum aș putea implementa următoarea poveste?

Avem o rachetă care se lansează de la sol. În funcție de câte secunde mai sunt până la lansare, vrem să ne pregătim pentru marele eveniment

Dacă mai avem **100** de secunde, pornim toate calculatoarele de la bord

Dacă mai avem **60** de secunde, verificăm conexiunea cu turnul de control

Dacă mai avem **20** de secunde, pornim motoarele secundare

Dacă mai avem **10** secunde, pornim motoarele principale

Dacă mai avem mai puțin de **10** secunde, verificăm dacă toate componentele funcționează corespunzător:
Dacă apare oriunde și cea mai mică eroare, anulăm lansarea

Aici putem vedea că avem 2 condiții una în interiorul celeilalte

```py
secunde = 100  # numărul de secunde
eroare_detectata = False # nicio eroare la început

if secunde == 100:
    print("Pornesc toate calculatoarele de la bord")
elif secunde == 60:
    print("Verific conexiunea cu turnul de control")
elif secunde == 20:
    print("Pornesc motoarele secundare")
elif secunde == 10:
    print("Pornesc motoarele principale")
elif secunde < 10:  # ultimele 10 secunde
    if eroare_detectata == True:
        print("Eroare detectată. Anulez misiunea")
    else:
        print("Nicio eroare detectată. Decolez...")
else: # număr necunoscut de secunde
    print(f"{secunde} secunde nu au niciun efect")
```

O explicație a acestui cod ar fi foarte complicată. **Rulează** codul așa cum este, apoi schimbă cele două variabile. Schimbă secunde în 60, 20, 10, apoi 9. Vezi cum se schimbă rezultatul programului. Schimbă și **eroare_detectata** în **True** și vezi cum reacționează programul. Codul poate părea intimidant, dar până la urmă este doar o poveste. Simte-te liber să **te joci**

Așadar, putem vedea cum **elif** nu este nimic mai mult decât un alt **if**. Totuși, de ce am folosit if-elif-elif-elif...else? **De ce să le înlănțuim?**

Dacă testăm **aceeași variabilă pentru mai multe cazuri**, le înlănțuim cu **if-elif-else**. Programul rulează de sus în jos. La primul if/elif a cărui condiție este adevărată, intră și rulează codul din acel bloc, iar apoi iese complet

```py
secunde = 60  # numărul de secunde
eroare_detectata = False # nicio eroare la început

if secunde == 100:
    print("Pornesc toate calculatoarele de la bord")
elif secunde == 60:
    # programul va intra aici și va afișa acest print
    print("Verific conexiunea cu turnul de control")
    # după ce îl afișează, sare afară din lanț
elif secunde == 20:
    print("Pornesc motoarele secundare")
elif secunde == 10:
    print("Pornesc motoarele principale")
elif secunde < 10:  # ultimele 10 secunde
    if eroare_detectata == True:
        print("Eroare detectată. Anulez misiunea")
    else:
        print("Nicio eroare detectată. Decolez...")
else: # număr necunoscut de secunde
    print(f"{secunde} secunde nu au niciun efect")

print("Programul sare direct aici și nu mai verifică restul instrucțiunilor elif sau else-ul")
```

Putem vedea rezultatul

```text
Verific conexiunea cu turnul de control
Programul sare direct aici și nu mai verifică restul instrucțiunilor elif sau else-ul
```

Dar de ce nu am scris programul așa?

```py
secunde = 60  # numărul de secunde
eroare_detectata = False # nicio eroare la început

if secunde == 100:
    print("Pornesc toate calculatoarele de la bord")
if secunde == 60:
    print("Verific conexiunea cu turnul de control")
if secunde == 20:
    print("Pornesc motoarele secundare")
if secunde == 10:
    print("Pornesc motoarele principale")
if secunde < 10:  # ultimele 10 secunde
    if eroare_detectata == True:
        print("Eroare detectată. Anulez misiunea")
    else:
        print("Nicio eroare detectată. Decolez...")
else: # număr necunoscut de secunde
    print(f"{secunde} secunde nu au niciun efect")

```

Vedem un rezultat incorect

```text
Verific conexiunea cu turnul de control
60 secunde nu au niciun efect
```

Vedem că pe ultima linie scrie **60 secunde nu au niciun efect**, dar asta nu este adevărat, din moment ce _Verific conexiunea cu turnul de control_ a fost afișat tocmai pentru că **secunde = 60** **:)**

Explicația completă este complexă, dar ca regulă generală: **dacă testăm aceeași variabilă pentru mai multe cazuri, înlănțuim if-elif-else**

---

## Misiune: Monitorul Nivelului de Oxigen

Stația verifică în permanență nivelul ei de `oxigen` (în procente) și dacă mai există `echipaj_la_bord`. În funcție de nivelul de oxigen, afișează **o singură** linie de stare folosind un lanț **if / elif / else**:

- `oxigen` este **80 sau mai mult** → `Oxigen nominal`
- `oxigen` este **între 50 și 79** → `Oxigen scăzut - conservați energia`
- `oxigen` este **între 20 și 49** → `Oxigen critic - sigilați compartimentul`
- sub **20** → este o urgență. Aici, verifică `echipaj_la_bord` cu un **if imbricat**:
  - dacă echipajul este încă la bord → `Urgența - evacuați acum`
  - altfel → `Nu avem echipaj la bord, deci aerisirea compartimentului este sigură`

- `oxigen` — nivelul de oxigen în procente
- `echipaj_la_bord` — dacă echipajul este încă pe stație

**Exemplu**

Cu `oxigen = 65`, programul tău ar trebui să afișeze

```text
Oxigen scăzut - conservați energia
```

Acum setează `oxigen = 12` și `echipaj_la_bord = True` și rulează din nou

```text
Urgența - evacuați acum
```

Și cu `oxigen = 12` și `echipaj_la_bord = False`

```text
Nu avem echipaj la bord, deci aerisirea compartimentului este sigură
```
