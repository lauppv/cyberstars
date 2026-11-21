Scrie un fișier, citește-l înapoi și tratează ce poate merge prost cu propria excepție și câteva catch-uri

---

## Misiune: Urma pe Hârtie

În fiecare noapte, oamenii lui Tommy predau banii strânși, scriși ca `nume,suma`. Unii scriu rânduri neglijente, iar alții încearcă să trișeze cu sume negative. Ken Rosenberg, avocatul, vrea totul într-un fișier

Fă o clasă excepție `SumaNegativaException` care extinde `Exception`. Mesajul ei e `sumă negativă`

Rândurile sunt într-un array `String[] intrari`. Scrie-le în fișierul `urma.txt`, câte unul pe rând. Apoi citește fișierul înapoi. Pentru fiecare rând, taie-l la virgulă și transformă suma în număr:

- Dacă suma nu e număr, afișează `Sumă greșită: rand`
- Dacă e sub 0, aruncă o `SumaNegativaException`, prinde-o și afișează `Respins: rand (sumă negativă)`, cu mesajul excepției în paranteze
- Altfel afișează `nume a plătit suma`

La final afișează `Total: ` cu suma sumelor bune

**Exemplu**

```text
Phil a plătit 500
Sumă greșită: Kent,multi
Respins: Lance,-200 (sumă negativă)
Mercedes a plătit 1500
Total: 2000
```

**Exemplu**

```text
Total: 0
```
