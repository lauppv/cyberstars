Combină **sortarea**, **tiparele enhanced**, **enum-urile**, și **switch**

---

## Misiune: Tabla de Comandă a Punții

Căpitanul stației folosește o tablă de priorități ca să urmărească sarcinile critice. Construiește sistemul tablei folosind enum-uri pentru nivelurile de prioritate, sortare pentru ordinea urgenței, și un switch pentru etichetele de afișare.

1. Definește un enum **`Prioritate`** cu valorile `SCAZUT`, `MEDIU`, `RIDICAT`, `CRITIC`
2. Creează o clasă **`Sarcina`** cu câmpurile: `titlu` (String), `prioritate` (Prioritate), `gata` (boolean)
3. Scrie **`static String etichetaPrioritate(Prioritate p)`** — folosește un **switch** ca să returnezi: SCAZUT -> `"[  ]"`, MEDIU -> `"[* ]"`, RIDICAT -> `"[**]"`, CRITIC -> `"[!!]"`
4. În main, creează un ArrayList de sarcini:
   - "Scrie teste" — RIDICAT — gata
   - "Repară bug" — CRITIC — nu e gata
   - "Actualizează docs" — SCAZUT — gata
   - "Review cod" — MEDIU — nu e gata
   - "Deploy" — CRITIC — nu e gata
5. **Sortează** lista după prioritate (CRITIC primul, SCAZUT ultimul) folosind `Collections.sort` cu un Comparator care compară valorile `.ordinal()` în ordine inversă
6. Afișează tabla cu o buclă for enhanced. Marchează sarcinile terminate cu `"(GATA)"`

**Output**

```text
=== TABLA DE SARCINI ===
[!!] Repară bug
[!!] Deploy
[**] Scrie teste (GATA)
[* ] Review cod
[  ] Actualizează docs (GATA)
```
