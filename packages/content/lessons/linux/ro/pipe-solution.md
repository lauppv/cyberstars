```bash
mkdir centru-comanda
grep mayday transmisii.log > centru-comanda/pericol.txt
cat transmisii.log | grep mayday | wc -l > centru-comanda/numar.txt
cat centru-comanda/numar.txt
```

```text
3
```
