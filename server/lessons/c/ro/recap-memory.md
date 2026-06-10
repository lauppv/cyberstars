Combină **malloc/free**, **enum-uri** și **typedef**

---

## Misiune: Tracker pentru Coada de Reparații

Stația a fost avariată de o ploaie de micrometeoriți. Phil are nevoie de un tracker dinamic de sarcini pentru a gestiona lucrările de reparații. Fiecare sarcină este alocată pe heap, are un status și trebuie eliberată când coada este golită.

Datele sunt deja în dreapta. Fă următoarele, în ordine:

1. Scrie **Sarcina *creeaza_sarcina(const char *titlu)** — alocă o Sarcina cu malloc, copiază titlul, setează statusul la **DE_FACUT**, returnează pointerul
2. Scrie **void actualizeaza_status(Sarcina \*s, Status st)** — actualizează statusul sarcinii
3. Scrie **const char \*nume_status(Status st)** — returnează "DE_FACUT", "IN_LUCRU" sau "GATA" (folosește un switch)
4. Scrie **void afiseaza_sarcina(Sarcina \*s)** — afișează sarcina ca **"[STATUS] Titlu"**
5. Creează 3 sarcini: "Invata pointeri" (actualizează la GATA), "Exerseaza struct-uri" (actualizează la IN_LUCRU), "Stapaneste malloc" (lasă la DE_FACUT)
6. Afișează toate trei, apoi eliberează memoria

**Output**

```text
[GATA] Invata pointeri
[IN_LUCRU] Exerseaza struct-uri
[DE_FACUT] Stapaneste malloc
```
