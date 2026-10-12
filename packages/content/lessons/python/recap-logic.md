This is a **recap**. Put to work everything we've learned so far: **input**, **booleans**, loops, and **break** / **continue**. You decide how to combine them

---

## Mission: Launch Console

Before launch, the operator enters the level of each rocket system, one by one, until they type `0`.

- a **negative** reading is noise and is ignored (don't print anything for it)
- a system with a level **below 50** is critical and makes the launch unsafe → print `Critical system`
- a system with a level **of 50 or more** is good → print `System OK`

When the operator types `0`, the input is over. If no system was critical, print `Launch authorized`. Otherwise, print `Launch aborted`.

**Example**

If the operator types `90`, then `75`, then `0` in turn, the program prints

```text
System OK
System OK
Launch authorized
```

If the operator types `90`, then `-5`, then `30`, then `80`, then `0` in turn, the program prints

```text
System OK
Critical system
System OK
Launch aborted
```
