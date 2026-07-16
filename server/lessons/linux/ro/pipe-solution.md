```bash
cat transmisii.log | grep mayday
cat transmisii.log | grep mayday > pericol.txt
mkdir centru-comanda
mv pericol.txt centru-comanda/
wc -l centru-comanda/pericol.txt
```

```text
mayday: defectiune motor pod 9
mayday: scurgere de oxigen sectorul 4
mayday: avertizare coliziune centura de asteroizi
3 centru-comanda/pericol.txt
```
