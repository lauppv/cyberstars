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

`tail`, la fel ca `head`, doar citește — nu modifică niciodată fișierul.

---

## Misiune: Eșantionează și arhivează alerta

Ceva a declanșat o alertă pe stație. Înainte de a completa raportul de incident, vrei
să eșantionezi log-ul de la ambele capete și să păstrezi o copie.

1. Uită-te doar la **primele 3 linii** din `sistem.log` ca să vezi cum a început după
   pornire.
2. Citește **ultimele 4 linii** din `sistem.log` — cele mai recente evenimente care au
   declanșat alerta.
3. Creează un folder numit `alerte` și copiază `sistem.log` în el sub numele
   `incident.log` pentru raport.

**Rezultat așteptat**

Vezi primele linii de pornire, apoi cele mai recente 4 linii de alertă. Folderul
`alerte` conține o copie a log-ului pentru evidența incidentului.
