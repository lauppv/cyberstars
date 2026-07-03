```bash
find statie -name "pericol.log"
grep -r "SOS" statie
which grep
```

```text
$ find statie -name "pericol.log"
statie/comunicatii/pericol.log

$ grep -r "SOS" statie
statie/comunicatii/vechi.log:semnal SOS de test arhivat
statie/comunicatii/pericol.log:SOS din capsula de salvare 4

$ which grep
/usr/bin/grep
```
