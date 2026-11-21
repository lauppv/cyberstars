Pune împreună indecșii negativi și slice-urile cu pas, split și join, formatele și codurile caracterelor

---

## Misiune: Raportul sistemelor

În fiecare oră stația trimite un jurnal scurt al sistemelor ei: numele fiecărui sistem și cât de bine merge, în procente. Jurnalul e o singură linie, cu `;` între sisteme și `=` între un nume și valoarea lui

1. Începe programul cu o variabilă **jurnal**, un string. De exemplu `jurnal = "motor ionic=93.456;scut=7.1;sistem de viata=100"`
2. Pentru fiecare sistem, afișează o linie: numele într-o coloană lată de 16 caractere, la stânga, apoi valoarea într-o coloană lată de 6 caractere, la dreapta, cu o zecimală, apoi ` %`
3. Afișează `Cod: ` și prima literă din numele fiecărui sistem, cu majusculă, de la ultimul sistem la primul
4. Afișează `Cheie: ` și totalul codurilor literelor din Cod

**jurnal** are între 1 și 8 sisteme. Un nume are între 1 și 15 caractere, litere mici și spații, și nu începe niciodată cu un spațiu. O valoare e un număr de la 0 la 100, cu cel mult 3 zecimale

**Exemplu** pentru jurnal = "motor ionic=93.456;scut=7.1;sistem de viata=100"

```text
motor ionic       93.5 %
scut               7.1 %
sistem de viata  100.0 %
Cod: SSM
Cheie: 243
```

`S` vine primul pentru că sistemul de viață e ultimul sistem. Cheia e 83 + 83 + 77, codurile lui `S`, `S` și `M`
