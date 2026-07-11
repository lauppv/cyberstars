Combine **if/else**, **if/else if** and **switch**

---

## Mission: Police Dispatch Center

Tommy has caused chaos in Vice City and the police are tracking his wanted level. The dispatch center needs a system that, given the number of wanted stars, reports **which force responds** and **how serious the situation is**.

Store the number of stars in an `int` variable named `stars`. Then:

Use a **switch** on the number of stars to print the responding force:

- **0** → `You are clean, no pursuit`
- **1** → `One police car spots you`
- **2** → `Several cars chase you`
- **3** → `A helicopter shows up`
- **4** → `Special forces arrive`
- **5** → `The FBI moves in`
- **6** → `The army rolls in tanks`
- any other value → `Invalid wanted level`

Then, on a second line, use an **if / else if** chain to print the danger assessment:

- **5 or more** stars → `Critical situation, run now`
- **3 or 4** stars → `High danger, escape fast`
- **1 or 2** stars → `Under control, lose them in the streets`
- otherwise → `All quiet`

Watch the boundaries: at **5** stars the situation turns critical, at **3** it goes from "under control" to "high danger".

**Example** for **3** stars:

```text
A helicopter shows up
High danger, escape fast
```

**Example** for **6** stars:

```text
The army rolls in tanks
Critical situation, run now
```

**Example** for **-1** stars (invalid value):

```text
Invalid wanted level
All quiet
```
