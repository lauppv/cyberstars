Combină **metode**, **valori returnate**, **metode pe șiruri**, **array-uri**, **parcurgerea array-urilor** și **break/continue** într-o singură misiune

---

## Misiune: Filtrul Stației Radio

Tommy ascultă stația radio a poliției din Vice City. Fluxul este plin de paraziți, iar la un moment dat operatorul închide cu un semnal de final. Scrie un filtru care curăță transmisia și păstrează doar numele reale.

Pune semnalele într-un array de `String` numit `semnale`, de exemplu:

```text
String[] semnale = { "tommy", "parazit", "lance", "parazit", "cortez", "parazit", "diaz", "gata", "mercedes" };
```

Scrie o **metodă** care primește array-ul de semnale și **returnează** un nou array care conține doar numele valide, scrise cu **majuscule**. Metoda trebuie să:

1. Parcurgă array-ul
2. **Sară** peste orice semnal egal cu `"parazit"` (folosește `continue` și `.equals()`)
3. **Se oprească** complet când întâlnește `"gata"` (folosește `break`); tot ce vine după este ignorat
4. Transforme numele valide cu `.toUpperCase()` și să le strângă în array-ul rezultat

În `main`, apelează metoda, afișează fiecare nume pe linia lui, apoi afișează **câte** nume au rămas.

**Sfat**: din moment ce nu știi de la început câte nume vor fi valide, parcurge array-ul de **două** ori: prima dată doar le numeri, apoi creezi array-ul rezultat de mărimea potrivită și îl umpli la a doua parcurgere.

**Exemplu**

Pentru `{ "tommy", "parazit", "lance", "parazit", "cortez", "parazit", "diaz", "gata", "mercedes" }`

```text
TOMMY
LANCE
CORTEZ
DIAZ
Total: 4
```

**Exemplu** când semnalul de final vine primul `{ "gata", "tommy", "lance" }` (niciun nume valid)

```text
Total: 0
```

**Exemplu** fără paraziți și fără semnal de final `{ "tommy", "lance" }`

```text
TOMMY
LANCE
Total: 2
```
