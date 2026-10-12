```bash
sort acces_usa.log | uniq -c
sort acces_usa.log | uniq -c > bilant-acces.txt
mkdir securitate
mv bilant-acces.txt securitate/
grep Voss securitate/bilant-acces.txt
```

```text
      2 Chen
      3 Tanaka
      3 Voss
      3 Voss
```
