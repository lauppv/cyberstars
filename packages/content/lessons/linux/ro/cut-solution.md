```bash
mkdir birou-punte
cut -d, -f1 manifest.csv > birou-punte/lista-articole.txt
cut -d, -f1,3 manifest.csv > birou-punte/destinatii.txt
cat birou-punte/destinatii.txt
```

```text
rezervoare_oxigen,deck1
pachete_ratii,deck3
truse_medicale,infirmerie
baterii,inginerie
filtre_apa,suport_vital
```
