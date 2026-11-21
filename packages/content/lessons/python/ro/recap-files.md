Pune împreună scrierea și citirea fișierelor, `with`, citirea linie cu linie și JSON

---

## Misiune: Jurnalul stației

Fiecare eveniment de pe stație intră într-un jurnal, câte unul pe linie: o oră și ce s-a întâmplat, ca `08:15 doc deschis`. La finalul zilei, calculatorul numără evenimentele din fiecare oră și păstrează acest rezumat ca JSON, pentru raportul săptămânal

1. Începe programul cu o variabilă **evenimente**, o listă de string-uri, fiecare o oră `HH:MM`, un spațiu și un text. De exemplu `evenimente = ["08:15 doc deschis", "08:40 pranzul echipajului", "13:05 doc inchis"]`
2. Scrie evenimentele în `evenimente.txt`, câte unul pe linie, cu un bloc `with`
3. Citește `evenimente.txt` linie cu linie și numără evenimentele din fiecare oră: ora e formată din cele două cifre dinainte de două puncte. Păstrează orele în ordinea în care apar prima oară
4. Salvează numărătorile în `rezumat.json` cu `json.dump()`, apoi încarcă-le înapoi cu `json.load()`
5. Din datele încărcate, afișează câte o linie pentru fiecare oră: ora, `: ` și numărul ei de evenimente. Apoi afișează `Cea mai aglomerata: ` și ora cu cele mai multe evenimente, prima dacă mai multe au tot atâtea. Apoi afișează `Caractere: ` și câte caractere are textul din `rezumat.json`

**evenimente** are între 1 și 20 de evenimente, deja în ordinea orelor

**Exemplu** pentru evenimentele de mai sus

```text
08: 2
13: 1
Cea mai aglomerata: 08
Caractere: 18
```

Textul din `rezumat.json` e `{"08": 2, "13": 1}`, care are 18 caractere
