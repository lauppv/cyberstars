```bash
echo "stare: scuturi nominale" >> misiune.log
echo "stare: echipaj pregatit" >> misiune.log
wc -l misiune.log
mkdir arhiva
cp misiune.log arhiva/misiune-backup.log
cat misiune.log
```

```text
3 misiune.log
stare: secventa de lansare initiata
stare: scuturi nominale
stare: echipaj pregatit
```
