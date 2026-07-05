Combină **malloc/free**, **enum-uri** și **typedef**

---

## Misiune: Coada de Intervenții Tehnice

Un incendiu de scurtcircuit a scos din funcțiune jumătate din sala de calcul. Tehnicianul de tură are nevoie de un tracker dinamic de sarcini pentru a gestiona lucrările de reparații. Fiecare sarcină este alocată pe heap, are un status și trebuie eliberată când coada este golită.

1. Definește **typedef enum { DE_FACUT, IN_LUCRU, GATA } Status;**
2. Definește **typedef struct { char titlu[100]; Status status; } Sarcina;**
3. Scrie **Sarcina \*creeaza_sarcina(const char \*titlu)** — alocă o Sarcina cu malloc, copiază titlul, setează statusul la **DE_FACUT**, returnează pointerul
4. Scrie **void actualizeaza_status(Sarcina \*s, Status st)** — actualizează statusul sarcinii
5. Scrie **const char \*nume_status(Status st)** — returnează "DE_FACUT", "IN_LUCRU" sau "GATA" (folosește un switch)
6. Scrie **void afiseaza_sarcina(Sarcina \*s)** — afișează sarcina ca **"[STATUS] Titlu"**
7. Citește din input un număr **n** de sarcini, urmat de **n** linii, fiecare cu un titlu (un singur cuvânt) și un cod de status (**0** = DE_FACUT, **1** = IN_LUCRU, **2** = GATA). Creează fiecare sarcină și actualizeaz-o la statusul citit
8. Afișează toate sarcinile, în ordine, apoi eliberează memoria

**Exemplu**

Intrare

```text
3
Verifica_banda 2
Repara_teletip 1
Recalibreaza_cititor 0
```

Ieșire

```text
[GATA] Verifica_banda
[IN_LUCRU] Repara_teletip
[DE_FACUT] Recalibreaza_cititor
```

**Exemplu**

Intrare

```text
2
Inlocuieste_siguranta 2
Curata_ventilatoare 0
```

Ieșire

```text
[GATA] Inlocuieste_siguranta
[DE_FACUT] Curata_ventilatoare
```
