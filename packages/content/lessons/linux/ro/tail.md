Opusul lui `head` este **tail**. Acesta afișează **ultimele linii** ale unui fișier.

În mod implicit, `tail` arată **ultimele 10 linii**:

```bash
tail fisier_mare.log
```

### Alegerea câte linii: `-n`

Exact ca la `head`, opțiunea `-n` stabilește numărul:

```bash
tail -n 3 fisier_mare.log
```

```text
linia 98
linia 99
linia 100
```

### De ce contează sfârșitul unui fișier

Fișierele de log cresc prin adăugarea de **linii noi la final**. Așadar, _cele mai
recente_ evenimente sunt mereu la **sfârșit**. Când tocmai s-a întâmplat ceva rău,
răspunsul este aproape întotdeauna în ultimele câteva linii:

```bash
tail -n 5 eroare.log
```

`head` îți arată cum _a început_ un fișier; `tail` îți arată _cele mai recente_
noutăți. Împreună îți permit să eșantionezi un fișier mare de la ambele capete fără
să citești mijlocul.

`tail`, la fel ca `head`, doar citește. Nu modifică niciodată fișierul.

---

## Misiune: Eșantionează și Arhivează Alerta

Ceva a declanșat o alertă. Înainte să completezi raportul de incident, eșantionează `sistem.log` de la ambele capete: cele trei linii cu care a început după pornire și cele mai recente patru linii, care au dus la alertă. Apoi păstrează o copie a jurnalului ca `alerte/incident.log`.

**Rezultat așteptat**

Vezi primele trei linii, apoi ultimele patru, iar copia din `alerte` spune ce spune originalul.
