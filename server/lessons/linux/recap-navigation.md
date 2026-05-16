Time to put the first chapter together. You now have three trusty tools for moving
around a Linux system:

- **pwd** — tells you *where* you are
- **ls** — tells you *what* is around you
- **cd** — *moves* you to a new directory

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

The station has a hidden archive. Starting from your home directory:

1. Use `ls` to look around.
2. Move into the `station` folder.
3. From there, move into the `archive` folder.
4. Inside `archive` there is a hidden directory. Use `ls -a` to find it, then `cd`
   into it.

When you finish, your current directory should be
`/home/student/station/archive/.vault`.
