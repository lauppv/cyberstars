Un fișier text ține doar text. Ca să salvăm un dicționar sau o listă și să primim mai târziu înapoi același dicționar sau aceeași listă, le scriem ca **JSON**, un format de text pe care îl înțeleg aproape toate limbajele și site-urile. Python îl citește și îl scrie cu modulul `json`

---

`json.dumps()` transformă datele Python într-un string JSON, iar `json.loads()` transformă string-ul înapoi în date Python

```py
import json

jucator = {"nume": "Ada", "nivel": 3, "obiecte": ["lanterna", "funie"], "viu": True}
text = json.dumps(jucator)
print(text)

inapoi = json.loads(text)
print(inapoi["nume"])
print(inapoi["obiecte"][1])
print(inapoi == jucator)
```

Rezultat

```text
{"nume": "Ada", "nivel": 3, "obiecte": ["lanterna", "funie"], "viu": true}
Ada
funie
True
```

JSON seamănă mult cu Python, cu mici diferențe: string-urile au mereu ghilimele duble, `True` devine `true`, `False` devine `false`, iar `None` devine `null`

---

Ca să lucrăm cu un fișier, folosim `json.dump()` și `json.load()`, fără `s`. Ele primesc fișierul deschis

```py
import json

punctaje = {"Ada": 12, "Alan": 7}
with open("punctaje.json", "w") as f:
    json.dump(punctaje, f)

with open("punctaje.json") as f:
    incarcate = json.load(f)
incarcate["Grace"] = 30
print(incarcate)
```

Rezultat

```text
{'Ada': 12, 'Alan': 7, 'Grace': 30}
```

Așa își amintește un program lucruri între rulări: încarcă fișierul la început, schimbă datele și le salvează din nou la final

---

`indent=` face JSON-ul mai ușor de citit pentru oameni, cu câte o valoare pe linie

```py
import json

print(json.dumps({"nume": "Ada", "luni": [1, 2]}, indent=2))
```

Rezultat

```text
{
  "nume": "Ada",
  "luni": [
    1,
    2
  ]
}
```

---

JSON știe string-uri, numere, true și false, null, liste și dicționare, și nimic altceva. Tuple-urile se întorc ca liste, iar cheile unui dicționar devin mereu string-uri

```py
import json

print(json.loads(json.dumps({1: (2, 3)})))
```

Rezultat

```text
{'1': [2, 3]}
```

---

## Misiune: Salvarea jocului

Un joc mic de pe stație salvează jucătorul între sesiuni. De fiecare dată când pornește jocul, încarcă salvarea, jucătorul urcă un nivel și găsește o hartă, iar jocul salvează din nou

1. Începe programul cu o variabilă **jucator**, un dicționar cu un `"nume"` (un string), un `"nivel"` (un număr întreg) și `"obiecte"` (o listă de string-uri). De exemplu `jucator = {"nume": "Ada", "nivel": 3, "obiecte": ["lanterna"]}`
2. Salvează **jucator** în `salvare.json` cu `json.dump()`
3. Încarcă `salvare.json` într-o variabilă nouă, adună 1 la nivelul ei și adaugă `"harta"` la finalul obiectelor ei
4. Salvează din nou datele schimbate în `salvare.json`, la fel, fără `indent`
5. Afișează textul din `salvare.json` așa cum e în fișier, apoi afișează `Nivelul era: ` și nivelul pe care îl are încă **jucator**

**jucator** are un nume din litere englezești, fără diacritice, un nivel de la 1 la 99 și între 0 și 5 obiecte cu litere mici

**Exemplu** pentru jucătorul de mai sus

```text
{"nume": "Ada", "nivel": 4, "obiecte": ["lanterna", "harta"]}
Nivelul era: 3
```
