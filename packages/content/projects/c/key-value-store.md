A small grocery keeps how many of each product it has in a program that forgets everything when the power goes off, and in winter that happens a lot. The owner wants the numbers saved on the disk, and wants to find any product at once, even with hundreds of them. You will build, in C, the kind of storage real databases are made of: one binary file cut into slots of the same size, where the name of a product tells you which slot to jump to.

**How it works.** The program reads commands and answers each one at once. Here is a session as you see it in the output box when you run a finished program. Each command you type is followed by the answer:

```text
Store ready: 101 slots, 2424 bytes
set tea 4
tea = 4 (slot 69)
set salt 2
salt = 2 (slot 70)
set flour 6
flour = 6 (slot 71)
set tea 5
tea = 5 (slot 69, was 4)
get flour
flour = 6 (3 slots checked)
get rice
rice not found (1 slot checked)
del salt
salt deleted from slot 70
get flour
flour = 6 (3 slots checked)
get salt
salt not found (4 slots checked)
dump
slot  69: tea = 5
slot  70: (deleted)
slot  71: flour = 6
set lemon 9
lemon = 9 (slot 70)
dump
slot  69: tea = 5
slot  70: lemon = 9
slot  71: flour = 6
stats
3 keys, 0 deleted, 98 empty, file 2424 bytes
quit
Bye
```

The commands:

| Command             | What it does                                               |
| ------------------- | ---------------------------------------------------------- |
| `set <key> <value>` | keeps a whole number under a name, the key                 |
| `get <key>`         | finds the number kept under a key                          |
| `del <key>`         | deletes a key                                              |
| `dump`              | shows every slot that is not empty                         |
| `stats`             | counts the slots of each kind and says how big the file is |
| `quit`              | ends the program                                           |

Some words you will meet:

| Word      | What it means                                                                 |
| --------- | ----------------------------------------------------------------------------- |
| key       | the name a value is kept under, like `tea`                                    |
| slot      | one place in the file for one key and its value. All slots have the same size |
| hash      | a number made from a key, which says which slot the key goes in               |
| collision | two keys with the same hash, so they want the same slot                       |

**To try your program**, press Run and type the commands in the output box, one on each line. `quit` ends the program.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests fill other shops. Passing them finishes the project.

## A file of slots

The store is a file, `store.db`, with 101 records. Each record is a struct, and all of them have the same size:

```c
struct Record {
    char key[16];
    int value;
    int state;  /* 0 empty, 1 used, 2 deleted */
};
```

Open the file with `fopen("store.db", "w+b")`. This makes a new, empty file each time the program starts, and lets you both read and write it, in binary. Write 101 records full of zeros with `fwrite`. Then print how big the file is: 101 times `sizeof(struct Record)`:

```text
Store ready: 101 slots, 2424 bytes
```

Then read commands until `quit`, print `Bye` and close the file with `fclose`. Read each command word with `scanf("%s", cmd)`, and use `strcmp` to see which one it is. For any other word, print `Unknown command: shout` and skip the rest of its line.

## Jump to a slot

All records have the same size, so slot `i` starts at byte `i * sizeof(struct Record)`. `fseek(db, offset, SEEK_SET)` goes to any byte of the file at once, without reading what comes before it.

Write two functions, `read_slot(i, &record)` and `write_slot(i, &record)`. Each one does an `fseek`, then an `fread` or an `fwrite` of one record. From now on, the program never keeps the records in memory: every command reads and writes the file.

## Which slot a key belongs to

A **hash** turns a key into a slot number. Start from 0. For each character of the key, multiply by 31, add the character, and keep what is left after dividing by 101:

```c
h = (h * 31 + c) % 101;
```

`apple` goes to slot 29, `tea` to slot 69. The same key always goes to the same slot, so finding it takes one jump.

## Set and get

- `set <key> <value>` keeps a whole number under a key of at most 15 characters, in the key's slot, and says where: `tea = 4 (slot 69)`. Setting a key that is already there changes its value: `tea = 5 (slot 69, was 4)`
- `get <key>` reads the value back and says how many slots it looked at: `flour = 6 (3 slots checked)`, or `rice not found (1 slot checked)`

But `salt` and `flour` also have the hash 69. When another key is in a key's slot, try the next slot, then the next one (after slot 100 comes slot 0). Stop when you find the key, or an empty slot, which means the key is not in the store:

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

A new key goes into the first slot that is not used. When every slot is used, `set` prints `Store full`. A key longer than 15 characters prints `Keys have at most 15 characters`. A `set` without a whole number prints `Usage: set <key> <value>`.

## Deleting without breaking the chain

`del <key>` deletes a key: `salt deleted from slot 70`, or `salt not found (4 slots checked)`.

Be careful here. If you just emptied slot 70, a `get flour` would stop at the empty slot 70 and never get to `flour` in slot 71. So a deleted slot gets the state 2, deleted. A search goes past it, like past a used slot, but `set` can put a new key there.

After deleting `salt`, `flour` is still found in 3 checks, and the next new key, `lemon`, takes slot 70.

## See inside

`dump` lists every slot that is not empty, in order. The slot number is right-aligned in 3 characters:

```text
slot  69: tea = 5
slot  70: (deleted)
slot  71: flour = 6
```

When every slot is empty, print `The store is empty`.

`stats` counts the slots of each kind and asks the file how big it is: `fseek` to the end (`SEEK_END`), then `ftell` says where you are, and that is the size:

```text
3 keys, 0 deleted, 98 empty, file 2424 bytes
```

The file never grows: every change writes over a slot in its place. Now the grocery's numbers are safe all winter.
