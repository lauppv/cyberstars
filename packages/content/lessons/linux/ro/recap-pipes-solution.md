```bash
grep WARN telemetrie.raw | sort > avertismente_sortat.txt
echo "-- sfarsit de raport --" >> avertismente_sortat.txt
cat avertismente_sortat.txt
```

```text
WARN: antena dezaliniata
WARN: celula de combustibil B scazuta
WARN: presiune agent de racire in scadere
-- sfarsit de raport --
```
