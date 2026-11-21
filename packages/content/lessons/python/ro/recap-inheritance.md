Pune împreună moștenirea, `super()`, suprascrierea metodelor, compararea obiectelor și dataclasses

---

## Misiune: Registrul flotei

Stația ține un registru al fiecărei nave care andochează. Toate navele au o viteză și un nume. Navele de marfă duc și un număr de tone și se descriu cu el

1. Scrie un dataclass **Nava** cu `order=True`, câmpurile `viteza` (un număr întreg) și `nume` (un string), în ordinea asta, și o metodă **descrie()** care returnează `nume (viteza)`
2. Scrie un dataclass **NavaMarfa** care moștenește din `Nava`, adaugă un câmp `tone` (un număr întreg) și suprascrie **descrie()**: returnează descrierea părintelui cu `, tone` și tonele adăugate, folosind `super()`
3. Începe programul cu o variabilă **nave**, o listă de string-uri. Fiecare string e un nume și o viteză, ca `"Speranta 12"`, sau, pentru o navă de marfă, un nume, o viteză și tone, ca `"Catar 8 300"`. De exemplu `nave = ["Speranta 12", "Catar 8 300", "Fulger 30", "Bou 8 500"]`
4. Fă o `Nava` sau o `NavaMarfa` din fiecare string și afișează descrierea fiecăreia, sortate de la cea mai lentă la cea mai rapidă. Navele cu aceeași viteză merg în ordinea numelor. Dă-i lui `sorted()` un `key`: dataclass-urile compară doar obiecte din aceeași clasă, așa că o `Nava` și o `NavaMarfa` nu se pot compara doar cu `<`
5. Afișează `Cea mai rapida: ` și numele navei sortate ultima
6. Afișează `Marfa: ` și tonele tuturor navelor de marfă adunate, găsite cu `isinstance()`

**nave** are între 1 și 10 nave, cu nume diferite dintr-un cuvânt și viteze de la 1 la 50. Tonele sunt de la 1 la 1000

**Exemplu** pentru navele de mai sus

```text
Bou (8), tone 500
Catar (8), tone 300
Speranta (12)
Fulger (30)
Cea mai rapida: Fulger
Marfa: 800
```
