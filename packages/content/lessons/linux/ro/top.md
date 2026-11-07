În timp ce `ps` îți oferă o instantanee unică, comanda `top` îți arată o vedere
**live, actualizată continuu** a proceselor, sortate după consumul de CPU sau
memorie. Este tabloul de bord al inginerului de stație.

Într-un terminal complet ai tasta pur și simplu:

```bash
top
```

Comanda preia ecranul și se reîmprospătează la câteva secunde. Apasă `q` pentru a
ieși.

Pentru că sandbox-ul nostru nu are un ecran interactiv, poți obține rezultate
asemănătoare cu `ps aux --sort`:

```bash
ps aux --sort=-%cpu
```

```text
USER       PID %CPU %MEM  ...  COMMAND
root        42  8.2  1.4  ...  /usr/bin/reactor-monitor --port=7700
root       305  1.1  0.8  ...  /usr/sbin/life-support
student   1201  0.0  0.2  ...  bash
```

`-%cpu` înseamnă „sortează după CPU, descrescător”: procesul cel mai lacom apare
primul. Poți sorta și după memorie: `--sort=-%mem`.

Pe o stație reală ai folosi `top` sau varianta sa mai prietenoasă, `htop`, ca să
urmărești procesele live. Aici, în sandbox, `ps aux --sort` este echivalentul
practic.

---

## Misiune: Vânătoarea Procesului Scăpat de Sub Control

Calculatorul principal al stației rămâne fără memorie, iar puntea vrea un raport scris despre vinovat înainte să pornească alarmele. Salvează linia de titlu a listei de procese și singurul proces care ține cea mai multă memorie, nimic altceva, ca `raport-memorie/vinovat-principal.txt`.

**Rezultat așteptat**

`raport-memorie/vinovat-principal.txt` are două linii: titlul listei de procese și procesul care ține cea mai multă memorie.
