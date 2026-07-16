```bash
cut -d, -f1 manifest.csv
cut -d, -f1 manifest.csv > lista-articole.txt
mkdir birou-punte
mv lista-articole.txt birou-punte/
wc -l birou-punte/lista-articole.txt
```

```text
rezervoare_oxigen
pachete_ratii
truse_medicale
baterii
filtre_apa
5 birou-punte/lista-articole.txt
```
