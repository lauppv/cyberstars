Time to put the first chapter together. You now have three trusty tools for moving
around a Linux system:

- **pwd** — tells you _where_ you are
- **ls** — tells you _what_ is around you
- **cd** — _moves_ you to a new directory

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

Station intelligence reports a hidden vault somewhere deep in the `station` directory. Your job is to navigate the folder structure and find it. Rumor has it the vault is invisible to a basic `ls`.

1. Use `ls` to see what is in your home directory.
2. Move into the `station` folder.
3. From there, move into the `archive` folder.
4. Inside `archive`, a hidden directory is waiting. Use `ls -a` to reveal it, then `cd` into it.

**Expected result**

Running `pwd` shows `/home/student/station/archive/.vault`. You found the vault.
