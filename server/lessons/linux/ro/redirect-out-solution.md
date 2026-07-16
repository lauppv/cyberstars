```bash
grep critical senzori.log > alerte.txt
grep ok senzori.log > sanatoase.txt
mkdir raport
mv alerte.txt sanatoase.txt raport/
cat raport/alerte.txt
```

```text
critical: scadere presiune puntea 7
critical: radiatii crescute laboratorul 3
```
