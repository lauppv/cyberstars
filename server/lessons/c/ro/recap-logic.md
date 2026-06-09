Combină **operatori**, **booleans** și **string-uri**

---

## Misiune: Validator de Acces pentru Sas

Sas-ul stației cere un cod de securitate înainte de a se deschide. Phil a scris modulul de autentificare dar nu a terminat niciodată logica de validare. Codul trebuie să treacă patru verificări înainte ca sas-ul să se deblocheze.

Datele sunt deja pe partea dreaptă. Fă următoarele, în ordine:

1. **Verificare lungime**: parola are cel puțin 8 caractere? (folosește **strlen**)
2. **Are literă mare**: conține cel puțin o literă mare? (A-Z înseamnă că char-ul este **>= 'A' && <= 'Z'**)
3. **Are cifră**: conține cel puțin o cifră? ('0'-'9')
4. **Are caracter special**: conține **'!'** sau **'@'** sau **'#'**?
5. Pentru fiecare verificare, afișează **"PASS"** sau **"FAIL"**
6. Afișează dacă **toate verificările au trecut** (**"YES"** sau **"NO"**)

**Output**

```text
Length >= 8: PASS
Has uppercase: PASS
Has digit: PASS
Has special char: PASS
Password valid: YES
```

Folosește o **buclă for** pentru a scana fiecare caracter, **flag-uri int** (0/1) pentru a urmări rezultatele, și **string.h** pentru strlen
