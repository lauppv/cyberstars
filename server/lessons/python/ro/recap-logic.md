Combină **input**, **operatori** și **booleeni**

---

## Misiune: Autorizarea Lansării

Înainte ca o rachetă să poată fi lansată, controlul misiunii verifică trei lucruri. Scrie un program care **citește trei numere** și decide dacă lansarea este autorizată.

Cele trei numere sunt **nivelul de combustibil** (un procent), **mărimea echipajului** și numărul de **verificări de siguranță finalizate**. Regulile sunt:

- combustibilul e OK când este **80 sau mai mult**
- echipajul e OK când este **între 2 și 6** (cel puțin 2 și cel mult 6)
- verificările sunt OK când sunt **exact 10**

Lansarea este autorizată doar când **toate trei** sunt OK. Folosește booleeni ca să stochezi fiecare rezultat.

**Input** (tastat de utilizator când rulează programul):

- nivelul de combustibil
- mărimea echipajului
- numărul de verificări de siguranță finalizate

**Output**

Patru linii: `Combustibil OK: ` apoi True sau False, `Echipaj OK: ` apoi True sau False, `Verificări OK: ` apoi True sau False, și în final `Autorizat: ` apoi True sau False.

**Exemplu**

Dacă utilizatorul tastează

```text
90
4
10
```

programul ar trebui să afișeze

```text
Combustibil OK: True
Echipaj OK: True
Verificări OK: True
Autorizat: True
```

Dacă utilizatorul tastează

```text
50
4
10
```

programul ar trebui să afișeze

```text
Combustibil OK: False
Echipaj OK: True
Verificări OK: True
Autorizat: False
```
