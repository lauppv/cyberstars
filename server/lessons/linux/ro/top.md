În timp ce `ps` îți oferă o instantanee unică, comanda `top` îți arată o vedere
**live, actualizată continuu** a proceselor — sortate după consumul de CPU sau
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

`-%cpu` înseamnă „sortează după CPU, descrescător” — procesul cel mai lacom apare
primul. Poți sorta și după memorie: `--sort=-%mem`.

Pe o stație reală ai folosi `top` sau varianta sa mai prietenoasă, `htop`, ca să
urmărești procesele live. Aici, în sandbox, `ps aux --sort` este echivalentul
practic.

---

## Misiune: Vânătoare după procesul scăpat de sub control

Computerul principal al stației se încălzește, iar puntea vrea să știe de ce.
Ceva mănâncă cicluri de CPU și trebuie să-l găsești înainte ca alarmele termice
să se declanșeze.

Rulează `ps aux --sort=-%cpu` pentru a lista toate procesele sortate după
consumul de CPU, cu cel mai mare primul.

**Rezultat așteptat**

Apare lista de procese cu cel mai mare consumator de CPU în vârf — identifică
ce program acaparează procesorul.
