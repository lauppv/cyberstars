Combine **operators**, **booleans**, and **strings**

---

## Mission: Airlock Access Validator

The station's airlock requires a security code before opening. Phil wrote the authentication module but never finished the validation logic. The code must pass four checks before the airlock unlocks.

The data is already on the right. Do the following, in order:

1. **Length check**: is the password at least 8 characters? (use **strlen**)
2. **Has uppercase**: does it contain at least one uppercase letter? (A-Z means the char is **>= 'A' && <= 'Z'**)
3. **Has digit**: does it contain at least one digit? ('0'-'9')
4. **Has special**: does it contain **'!'** or **'@'** or **'#'**?
5. For each check, print **"PASS"** or **"FAIL"**
6. Print whether **all checks passed** (**"YES"** or **"NO"**)

**Output**

```text
Length >= 8: PASS
Has uppercase: PASS
Has digit: PASS
Has special char: PASS
Password valid: YES
```

Use a **for loop** to scan each character, **int** flags (0/1) to track results, and **string.h** for strlen
