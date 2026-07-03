Până acum doar ai _privit_ directoarele. Acum vei învăța să **te deplasezi între
ele**.

Comanda **cd** (**change directory**) te duce într-un alt folder. După `cd`,
_directorul tău curent de lucru_ se schimbă — iar `pwd` o va confirma.

### Intrarea într-un folder

Dă-i lui `cd` numele unui folder care există în locul unde te afli:

```bash
cd rapoarte
pwd
```

```text
/home/student/rapoarte
```

Te-ai deplasat **în jos**, în `rapoarte`.

### Întoarcerea în sus: `..`

Numele special `..` înseamnă **directorul părinte** — un nivel mai sus. Pentru a
ieși din `rapoarte` și a te întoarce în `/home/student`:

```bash
cd ..
pwd
```

```text
/home/student
```

### Scurtături utile

| Comandă | Unde te duce                                                             |
| ------- | ------------------------------------------------------------------------ |
| `cd ~`  | directorul tău **personal** (`/home/student`)                            |
| `cd /`  | **rădăcina** întregului sistem                                           |
| `cd ..` | un director mai **sus**                                                  |
| `cd`    | tot acasă — scrierea lui `cd` fără nimic este o scurtătură pentru `cd ~` |

### Căi

Poți sări și peste mai multe niveluri deodată, dând o **cale** completă:

```bash
cd /home/student/rapoarte
```

O cale care începe cu `/` este **absolută** — funcționează indiferent unde te
afli. O cale fără `/` la început (precum `rapoarte`) este **relativă** — se
interpretează pornind de la locația ta curentă.

Sfat: te-ai pierdut? `cd ~` te aduce mereu acasă, iar `pwd` îți spune mereu unde te afli.

---

## Misiune: Ajunge la Seiful de Scripturi

Un script de automatizare critic este stocat adânc în sistemul de fișiere al stației. Directorul tău personal conține un folder `unelte`, iar în interiorul acestuia se află un folder `scripturi`.

1. Navighează în folderul `unelte`.
2. De acolo, navighează în folderul `scripturi`.

**Rezultat așteptat**

Rulând `pwd` se afișează `/home/student/unelte/scripturi` — ai ajuns la seif.
