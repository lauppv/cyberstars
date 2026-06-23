Combine **string methods**, **lists**, **looping over lists**, and **break/continue**

---

## Mission: Supply Run

The station receives a list of supply crates (already on the right). Some crates are contaminated — their name starts with `con-`. Sort the good supplies into a clean list with these rules:

1. Loop through the items.
2. **Skip** any crate whose **first four characters** are `con-`
3. For every good crate, add it to a new list called `clean`
4. The moment you add `butter`, the bay is full — **stop** right after adding it
5. Print each item in `clean`, one per line
6. Print `Total: ` then how many items ended up in `clean`

**Output**

```text
milk
bread
cheese
butter
Total: 4
```

The two `con-` crates are skipped, and the loop stops as soon as `butter` is added — so `jam` is never reached.
