Capitolul 4 te-a transformat într-un detectiv al stației. Trei unelte de căutare,
trei întrebări diferite:

| Comandă | Întrebare                               |
| ------- | --------------------------------------- |
| `grep`  | „Care **linii** conțin acest cuvânt?”   |
| `find`  | „Unde se află acest **fișier**?”        |
| `which` | „Unde este instalat acest **program**?” |

Reține opțiunile puternice: `grep -r` caută în arbori întregi, `grep -i` ignoră
majusculele/minusculele, `grep -v` inversează; `find -name` potrivește după nume,
`find -type` filtrează între fișiere și foldere.

---

## Misiune: Urmărirea Semnalului de Salvare

Un semnal de pericol slab vine de undeva din directorul `statie`. Comanda are nevoie să-l urmărești:

1. Găsește fișierul numit `pericol.log`, oriunde ar sta în arborele `statie`.
2. Găsește fiecare linie care pomenește `SOS` în orice fișier de sub `statie`, cu fișierul din care vine fiecare. Nu orice SOS e real: unul e un semnal vechi de test.
3. Predă apelul real echipei de salvare: copiază jurnalul care ține SOS-ul real în `salvare/semnal.log`.
4. Echipa de salvare vrea să ruleze aceeași căutare pe calculatorul ei: arată-le unde e instalat programul cu care ai căutat textul.

**Rezultat așteptat**

Știi unde e `pericol.log` și care SOS e real, `salvare/semnal.log` e o copie a jurnalului cu apelul real, iar tu vezi calea programului de căutare.
