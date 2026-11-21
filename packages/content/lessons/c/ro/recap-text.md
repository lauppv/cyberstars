Citește până se termină datele, împarte liniile cu strtok și transformă textul în numere, totul într-un singur program mic

---

## Misiune: Consola operatorului

Mainframe-ul are o consolă mică la care operatorii scriu comenzi scurte. Fiecare comandă e un cuvânt scurt, urmat de argumentele ei, despărțite prin spații. Tu scrii programul care le răspunde

1. Citește comenzi, câte una pe linie, până se termină datele
2. Împarte fiecare linie în cuvinte cu strtok. Primul cuvânt e comanda
3. Răspunde la fiecare comandă cu o linie
   - **add** urmat de numere întregi: afișează suma lor
   - **max** urmat de numere întregi: afișează-l pe cel mai mare
   - **echo** urmat de orice cuvinte: afișează cuvintele cu exact un spațiu între ele
   - orice altă comandă: afișează `Comanda necunoscuta: ` și comanda
4. Verifică fiecare număr de la add și max cu strtol. Dacă unul dintre ele nu e un număr întreg, afișează `Numar gresit: ` și primul astfel de cuvânt, în locul răspunsului

add și max primesc mereu cel puțin un argument. Nu există linii goale, iar fiecare linie are cel mult 100 de caractere

**Exemplu**

Intrare

```text
add 3 4 5
max 7 2 9
echo hello   tape   room
add 2 x
jump 1
```

Ieșire

```text
12
9
hello tape room
Numar gresit: x
Comanda necunoscuta: jump
```
