Combine **classes/objects**, **constructors**, **methods inside classes**, and **Math class**

---

## Mission: Station Pet Bay

The crew adopted a few animals for morale. The station's pet bay needs a tracking system to monitor each pet's happiness after play and feeding sessions.

Create a class **`Pet`** with:

- Fields: `name` (String), `species` (String), `age` (int), `happiness` (int, starts at 50)
- **Constructor** that takes name, species, and age
- Method **`play()`** — increases happiness by 15, but caps at 100 (use `Math.min`)
- Method **`feed()`** — increases happiness by 10, but caps at 100
- Method **`status()`** — returns a String: `"Name (Species, age Y) - Happiness: X"`

The interaction sequence in main is already on the right. Fill in the `Pet` class so that Rex, Whiskers, and Nemo report the correct happiness after their sessions. Nemo caps at 100 even though 50 + 4\*15 = 110.

**Output**

```text
Rex (Dog, age 3) - Happiness: 90
Whiskers (Cat, age 5) - Happiness: 60
Nemo (Fish, age 1) - Happiness: 100
```
