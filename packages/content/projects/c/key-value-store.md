A small grocery keeps its stock counts in a program that loses everything when the power goes out, which in winter happens a lot. The owner wants the numbers on disk, and wants looking one up to stay instant even with hundreds of products. You'll build the kind of storage real databases are made of: one binary file cut into equal slots, where a product's name tells you which slot to jump straight to.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests stock shops your program has never seen. Passing them finishes the project.

The program reads everything with `scanf` and writes everything with `printf`. Commands are words: `scanf("%s", cmd)` reads the next one, and `strcmp` tells which it is.

## A file of slots

The store is a file, `store.db`, of 101 records, each a struct of the same size:

```c
struct Record {
    char key[16];
    int value;
    int state;  /* 0 empty, 1 used, 2 deleted */
};
```

Open it with `fopen("store.db", "w+b")`, which creates it fresh (the store starts empty every time the program starts) and lets you both read and write it, in binary. Write 101 records full of zeros with `fwrite`, then say how big the file is, 101 times `sizeof(struct Record)`:

```text
Store ready: 101 slots, 2424 bytes
```

Then read commands until `quit`, and print `Bye` then (and `fclose` the file). Any other word prints `Unknown command: shout` and skips the rest of its line.

## Jump to a slot

Because every record has the same size, slot `i` starts at byte `i * sizeof(struct Record)`. `fseek(db, offset, SEEK_SET)` moves to any byte of the file at once, without reading what comes before it. Write two functions, `read_slot(i, &record)` and `write_slot(i, &record)`, each an `fseek` followed by an `fread` or `fwrite` of one record. From here on, the program never keeps the records in memory: every command reads and writes the file.

## Which slot a key belongs to

A **hash** turns a key into a slot number. Start from 0, and for each character of the key, multiply by 31, add the character, and keep the remainder of dividing by 101:

```c
h = (h * 31 + c) % 101;
```

`apple` lands in slot 29, `tea` in slot 69. The same key always lands in the same slot, so finding it takes one jump.

## Set and get

- `set <key> <value>` stores a whole number under a key of at most 15 characters, in the key's slot, and says where: `tea = 4 (slot 69)`. Setting a key that's already there changes its value: `tea = 5 (slot 69, was 4)`
- `get <key>` reads it back and says how many slots it had to look at: `flour = 6 (3 slots checked)`, or `rice not found (1 slot checked)`

But `salt` and `flour` also hash to 69. When a key's slot is taken by another key, try the next slot, and the next (after slot 100 comes slot 0), until you find the key, or an empty slot, which means it isn't in the store:

```text
set tea 4
tea = 4 (slot 69)
set salt 2
salt = 2 (slot 70)
set flour 6
flour = 6 (slot 71)
get flour
flour = 6 (3 slots checked)
```

A new key goes into the first slot that isn't used. When every slot is used, `set` prints `Store full`. A key longer than 15 characters prints `Keys have at most 15 characters`, and a `set` without a whole number `Usage: set <key> <value>`.

## Deleting without breaking the chain

`del <key>` removes a key: `salt deleted from slot 70`, or `salt not found (4 slots checked)`.

Careful: if you simply emptied slot 70, a `get flour` would stop at the empty slot 70 and never reach `flour` in 71. So a deleted slot gets the state 2, deleted: searching goes past it like a used slot, but `set` can put a new key there. After deleting `salt`, `flour` is still found in 3 checks, and the next new key, `lemon`, takes slot 70.

## See inside

`dump` lists every slot that isn't empty, in order, the slot number right-aligned in 3:

```text
slot  69: tea = 5
slot  70: (deleted)
slot  71: flour = 6
```

With nothing in it, `The store is empty`. `stats` counts the slots of each kind and asks the file how big it is: `fseek` to the end (`SEEK_END`), then `ftell` says where you are, which is the size:

```text
3 keys, 0 deleted, 98 empty, file 2424 bytes
```

The file never grows: every change overwrites a slot in place. The grocery's counts now survive the winter.
