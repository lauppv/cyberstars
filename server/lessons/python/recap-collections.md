Combine **string methods**, **lists**, **looping over lists**, and **break/continue**

---

Build a **shopping list manager**. You have this list of items:

```python
items = ["milk", "bread", "EXPIRED_eggs", "cheese", "EXPIRED_yogurt", "butter", "jam"]
```

Do the following:

1. Loop through the items. **Skip** any item that starts with "EXPIRED\_" (use **continue** and **.startswith()**)
2. For the valid items, capitalize them (use **.upper()**) and add them to a new list called **clean_list**
3. If you find **"butter"**, stop processing — we have enough (use **break**)
4. Print each item in clean_list, one per line
5. Print the total count

Expected output

```text
MILK
BREAD
CHEESE
BUTTER
Total: 4 items
```
