Combină **tuple**, **set-uri**, **bucle imbricate** și **list comprehension**

---

## Misiune: Analiza Echipajului

Compari două echipe. Fiecare membru al echipajului este un **tuple** de forma `(nume, scor)` (ambele liste sunt deja în dreapta):

```python
echipa_a = [("Tommy", 85), ("Lance", 72), ("Cortez", 91), ("Phil", 60)]
echipa_b = [("Mira", 88), ("Lance", 65), ("Tommy", 91), ("Quinn", 72)]
```

Fă următoarele, în ordine:

1. Pune **numele din echipa B** într-un **set**. Apoi afișează `În ambele:` și, pe liniile următoare, parcurge **echipa A în ordine** și afișează fiecare nume care **se află de asemenea în** acel set.
2. Folosește o **list comprehension** ca să aduni fiecare scor din **echipa A** care este **peste 80**. Afișează `Scoruri mari echipa A: ` apoi acea listă.
3. Afișează `Potriviri:` și apoi folosește **bucle imbricate** (echipa A în exterior, echipa B în interior) ca să afișezi fiecare pereche care are **același scor**, sub forma `nume1 și nume2 au amândoi scorul X`.

**Ieșire**

```text
In ambele:
Tommy
Lance
Scoruri mari echipa A: [85, 91]
Potriviri:
Lance si Quinn au amandoi scorul 72
Cortez si Tommy au amandoi scorul 91
```
