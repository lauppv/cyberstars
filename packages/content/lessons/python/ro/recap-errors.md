Pune împreună `raise`, excepțiile tale și `else` și `finally`

---

## Misiune: Controlul ecluzei

Ecluza se deschide doar când presiunea dinăuntru e sigură: de la 90 la 110. Presiunea vine ca text de la un senzor care uneori trimite zgomot. După fiecare încercare, sigură sau nu, ecluza își face verificarea etanșării

1. Scrie o clasă **EroareEcluza** care moștenește din `Exception` și o clasă **EroarePresiune** care moștenește din ea. `EroarePresiune` primește presiunea, o păstrează ca `presiune` și are mesajul `presiunea`, presiunea și `in afara limitelor`, ca `presiunea 85 in afara limitelor`
2. Scrie o funcție **deschide_ecluza(text)** care transformă textul într-un număr întreg, aruncă `EroarePresiune` când numărul e sub 90 sau peste 110 și altfel returnează `deschisa`. Un text care nu e număr aruncă `ValueError`-ul lui Python, pe care funcția îl lasă în pace
3. Începe programul cu o variabilă **citiri**, o listă de string-uri. De exemplu `citiri = ["100", "85", "abc", "110"]`
4. Pentru fiecare citire, apelează `deschide_ecluza()` într-un `try`. Afișează citirea, `: ` și:
   - la o `EroarePresiune`, mesajul ei
   - la un `ValueError`, `nu e un numar`
   - în `else`, ce a returnat funcția
5. În `finally`, numără verificările etanșării. La final, afișează `Deschideri: ` și de câte ori s-a deschis ecluza, `Verificari: ` și câte verificări au rulat, și `Cea mai departe: ` și presiunea `EroarePresiune` cea mai departe de 100, sau `niciuna` dacă n-a fost niciuna. Dacă două sunt la fel de departe, ia-o pe prima

**citiri** are între 1 și 10 citiri

**Exemplu** pentru valorile de mai sus

```text
100: deschisa
85: presiunea 85 in afara limitelor
abc: nu e un numar
110: deschisa
Deschideri: 2
Verificari: 4
Cea mai departe: 85
```
