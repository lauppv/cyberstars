Datele calendaristice sunt mai grele decât par: lunile au între 28 și 31 de zile, unii ani au 29 februarie, iar săptămânile nu încap exact în luni. Modulul `datetime` le știe pe toate, ca să nu trebuiască să le știm noi

---

`date(an, luna, zi)` face o dată. Îi putem citi părțile și o putem afișa

```py
from datetime import date

lansare = date(2031, 5, 14)
print(lansare)
print(lansare.year, lansare.month, lansare.day)
```

Rezultat

```text
2031-05-14
2031 5 14
```

Datele vin des ca text în forma an-lună-zi. `date.fromisoformat()` citește un astfel de text într-o dată: `date.fromisoformat("2031-05-14")`

---

`timedelta` e o durată, ca 5 zile. Adunată la o dată, mută data, și peste luni și ani. Scăzând o dată din alta obținem un `timedelta`, iar `.days` al lui e numărul de zile dintre ele

```py
from datetime import date, timedelta

d = date.fromisoformat("2031-12-30")
print(d + timedelta(days=5))
print((date(2032, 1, 1) - date(2031, 5, 14)).days)
```

Rezultat

```text
2032-01-04
232
```

---

`.strftime()` scrie o dată cum vrem noi. Codurile cu `%` țin locul părților ei: `%A` ziua săptămânii, `%d` ziua cu două cifre, `%B` numele lunii, `%Y` anul. Orice altceva e copiat așa cum e

```py
from datetime import date

lansare = date(2031, 5, 14)
print(lansare.strftime("%A %d %B %Y"))
print(lansare.strftime("%d.%m.%Y"))
```

Rezultat

```text
Wednesday 14 May 2031
14.05.2031
```

Numele zilelor și lunilor ies în engleză, așa cum le scrie Python. `.weekday()` dă ziua săptămânii ca număr: 0 pentru luni până la 6 pentru duminică. Așa că `lansare.weekday() >= 5` ne spune dacă o dată cade în weekend

---

`date.today()` dă data de azi, iar `datetime.now()` data și ora din clipa asta. Sunt utile, dar se schimbă în fiecare zi, așa că un program care le afișează dă alt răspuns de fiecare dată. Ca să testezi un program, dă-i în loc date fixe

```py
from datetime import date

print(date.today().year >= 2026)
```

Rezultat

```text
True
```

---

## Misiune: Calendarul misiunilor

Fiecare călătorie de pe stație are o dată de lansare și o durată în zile. Echipajul vrea datele scrise pe larg și să știe dacă se întoarce în weekend

1. Începe programul cu două variabile: **lansare**, un string cu o dată ca `"2031-05-14"`, și **zile**, un număr întreg. De exemplu `lansare = "2031-05-14"` și `zile = 10`
2. Afișează `Lansare: ` și data lansării ca ziua săptămânii, ziua cu două cifre, numele lunii și anul, ca `Wednesday 14 May 2031`
3. Afișează `Intoarcere: ` și data de după `zile` zile de la lansare, scrisă la fel
4. Afișează `Weekend: ` și `da` dacă întoarcerea cade sâmbătă sau duminică, sau `nu`
5. Afișează `Pana la anul nou: ` și câte zile sunt de la lansare până la 1 ianuarie a anului următor

**lansare** e o dată adevărată din anii 2000-2099, iar **zile** e de la 0 la 1000

**Exemplu** pentru lansare = "2031-05-14" și zile = 10

```text
Lansare: Wednesday 14 May 2031
Intoarcere: Saturday 24 May 2031
Weekend: da
Pana la anul nou: 232
```
