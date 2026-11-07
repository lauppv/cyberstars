Time to put the first chapter together. You now have three trusty tools for moving
around a Linux system:

- **pwd**: tells you _where_ you are
- **ls**: tells you _what_ is around you
- **cd**: _moves_ you to a new directory

None of these change or delete anything, so you can explore freely. The golden habit
of every cadet:

```bash
pwd    # confirm where you are
ls     # look at what is here
cd somewhere   # move on
```

Repeat that loop and you will never get lost. If you ever do, `cd ~` brings you
straight home.

### Reading what `ls` shows you

Remember `ls -l` puts a `d` in front of directories and a `-` in front of files. Use
it whenever you need to know which names you can `cd` into.

---

## Mission: The Hidden Vault

Station intelligence reports a vault hidden somewhere inside the `station` directory. The vault is a folder, and a plain listing won't show it. Search the structure folder by folder and finish standing inside the vault.

**Expected result**

You stand in the vault, and listing it shows what it keeps.
