Combine **operators**, **booleans**, and **strings**

---

Write a **password validator**. The password is stored as a char array. Check these rules and print the result for each:

Given the password **"Cyber2025!"**:

1. **Length check**: is it at least 8 characters? (use **strlen**)
2. **Has uppercase**: does it contain at least one uppercase letter? (A-Z means the char is **>= 'A' && <= 'Z'**)
3. **Has digit**: does it contain at least one digit? ('0'-'9')
4. **Has special**: does it contain **'!'** or **'@'** or **'#'**?

For each check, print **"PASS"** or **"FAIL"**. Then print whether **all checks passed**

Expected output

```text
Length >= 8: PASS
Has uppercase: PASS
Has digit: PASS
Has special char: PASS
Password valid: YES
```

You'll need a **for loop** to go through each character, **booleans** (use int 0/1) to track what you found, **if/else** for the conditions, and **string.h** for strlen. Everything we've learned so far :)
