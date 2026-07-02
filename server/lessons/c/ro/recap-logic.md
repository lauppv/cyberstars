Combină **operatori**, **booleans** și **string-uri**

---

## Misiune: Validatorul de parole al centrului de calcul

La intrarea în centrul de calcul, terminalul de acces cere un cod de securitate înainte de a permite conectarea. Modulul de validare a fost început de un fost operator, dar el a plecat înainte de a termina logica de verificare. Parola trebuie să treacă patru verificări înainte de a fi acceptată.

Citește o parolă (un singur cuvânt, fără spații) cu **scanf**, apoi fă următoarele, în ordine:

1. **Verificare lungime**: parola are cel puțin 8 caractere? (folosește **strlen**)
2. **Are literă mare**: conține cel puțin o literă mare? (A-Z înseamnă că char-ul este **>= 'A' && <= 'Z'**)
3. **Are cifră**: conține cel puțin o cifră? ('0'-'9')
4. **Are caracter special**: conține **'!'** sau **'@'** sau **'#'**?
5. Pentru fiecare verificare, afișează **PASS** sau **FAIL**
6. Afișează dacă **toate verificările au trecut** (**YES** sau **NO**)

Folosește o **buclă for** pentru a scana fiecare caracter, **flag-uri int** (0/1) pentru a urmări rezultatele, și **string.h** pentru **strlen**

**Exemplu**

Input

```text
Cyber2025!
```

Output

```text
Length >= 8: PASS
Has uppercase: PASS
Has digit: PASS
Has special char: PASS
Password valid: YES
```

**Exemplu**

Input

```text
abcdef
```

Output

```text
Length >= 8: FAIL
Has uppercase: FAIL
Has digit: FAIL
Has special char: FAIL
Password valid: NO
```
