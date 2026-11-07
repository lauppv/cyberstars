```bash
echo "RAPORT TELEMETRIE" > raport.txt
grep WARN telemetrie.raw | sort >> raport.txt
grep ERR telemetrie.raw | sort >> raport.txt
echo "-- sfarsit de raport --" >> raport.txt
cat raport.txt
```

```text
RAPORT TELEMETRIE
WARN: antena dezaliniata
WARN: celula de combustibil B scazuta
WARN: presiune agent de racire in scadere
ERR: alimentare de rezerva offline
ERR: defect giroscop
-- sfarsit de raport --
```
