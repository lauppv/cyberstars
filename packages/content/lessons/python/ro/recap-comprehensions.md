Pune împreună dict și set comprehension, generatoarele și generator expressions

---

## Misiune: Fluxul de la senzori

Senzorii stației trimit un flux de linii scurte. Fiecare linie e numele unui senzor, două puncte și un număr întreg pe care l-a măsurat, ca `temp:21`. Un senzor poate trimite multe linii, iar cea mai nouă valoare e cea care contează

1. Începe programul cu o variabilă **flux**, o listă de string-uri. De exemplu `flux = ["temp:21", "aer:98", "temp:23", "zgomot:4"]`
2. Scrie un generator **citeste(linii)** care dă câte o pereche pentru fiecare linie: numele senzorului și valoarea lui ca număr întreg. Folosește `yield`
3. Afișează `Senzori: ` și lista sortată a numelor senzorilor, fiecare nume o dată, făcută cu un set comprehension
4. Afișează `Ultimele: ` și un dicționar cu cea mai nouă valoare a fiecărui senzor, făcut cu un dict comprehension. Senzorii sunt în ordinea în care apar prima oară în flux
5. Afișează `Suma: ` și totalul tuturor valorilor din flux, făcut cu o generator expression

**flux** are între 1 și 30 de linii. Un nume are între 1 și 10 litere mici, iar o valoare e de la -1000 la 1000

**Exemplu** pentru fluxul de mai sus

```text
Senzori: ['aer', 'temp', 'zgomot']
Ultimele: {'temp': 23, 'aer': 98, 'zgomot': 4}
Suma: 146
```

`temp` rămâne primul în Ultimele, unde apare prima oară, dar are 23, cea mai nouă valoare a lui
