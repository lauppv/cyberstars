Combine **input**, **operators**, **booleans**, and **string methods**

---

Build a **username validator**. Given these variables:

```python
username = "Cyber_Star42"
```

Check these rules and print the result for each:
1. **Length**: between 3 and 20 characters (use **len()**)
2. **Starts with letter**: first character is a letter (use **.isalpha()**)
3. **No spaces**: the username contains no spaces (use **" " not in username** or **.count(" ")**)
4. **Has a number**: at least one digit somewhere (loop through and use **.isdigit()**)

Print each check, then whether the username is **valid** (all checks pass)

Expected output
```text
Length OK: True
Starts with letter: True
No spaces: True
Has a number: True
Username valid: True
```
