Combine **operators**, **booleans**, and **strings**

---

## Mission: The Computing Center's Password Validator

At the entrance to the computing center, the access terminal asks for a security code before allowing you to connect. The validation module was started by a former operator, but he left before finishing the verification logic. The password must pass four checks before it is accepted.

Read a password (single word, no spaces) with **scanf**, then do the following, in order:

1. **Length check**: is the password at least 8 characters long? (use **strlen**)
2. **Has uppercase**: does it contain at least one uppercase letter? (A-Z means the char is **>= 'A' && <= 'Z'**)
3. **Has digit**: does it contain at least one digit? ('0'-'9')
4. **Has special character**: does it contain **'!'** or **'@'** or **'#'**?
5. For each check, print **PASS** or **FAIL**
6. Print whether **all checks passed** (**YES** or **NO**)

Use a **for loop** to scan each character, **int flags** (0/1) to track results, and **string.h** for **strlen**

**Example**

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

**Example**

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
