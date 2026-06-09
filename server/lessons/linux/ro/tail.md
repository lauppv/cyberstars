Opusul lui `head` este **tail**. Acesta afișează **ultimele linii** ale unui fișier.

În mod implicit, `tail` arată **ultimele 10 linii**:

```bash
tail bigfile.log
```

### Alegerea câte linii: `-n`

Exact ca la `head`, opțiunea `-n` stabilește numărul:

```bash
tail -n 3 bigfile.log
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
tail -n 5 error.log
```

`head` îți arată cum _a început_ un fișier; `tail` îți arată _cele mai recente_
noutăți. Împreună îți permit să eșantionezi un fișier mare de la ambele capete fără
să citești mijlocul.

`tail`, la fel ca `head`, doar citește — nu modifică niciodată fișierul.

---

## Misiune: Verifică ultimele alerte

Ceva a declanșat o alertă pe stație. Cele mai recente evenimente sunt mereu la
sfârșitul fișierului `system.log`. Trebuie să verifici ce tocmai s-a întâmplat.

Folosește `tail` cu opțiunea `-n` pentru a afișa doar **ultimele 4 linii** din
`system.log`.

**Rezultat așteptat**

Apar cele mai recente 4 înregistrări din log, arătându-ți cele mai noi evenimente ale
stației.
