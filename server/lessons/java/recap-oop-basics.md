Combine everything from this module: **classes and objects**, **constructors**, **instance methods** that modify the object, and **`toString()`**

---

## Mission: Tommy's Crew

Tommy is building a crew in Vice City and wants to track each member's respect. Respect goes up when a member trains or runs a mission, but never goes above 100

Create a class **`CrewMember`** with:

- fields for name (String), role (String), years (int, how long they've been in the crew), and respect (int, starting at 50)
- a **constructor** that takes the name, role, and years
- a method **`train()`** that raises respect by 15, without going above 100
- a method **`mission()`** that raises respect by 10, without going above 100
- a text representation in the format `Name (Role, Y years) - Respect: X`, so you can print a member directly with `System.out.println`

In `main`, store each member's details in variables — `name1`, `role1`, `years1` for the first, `name2`, `role2`, `years2` for the second, `name3`, `role3`, `years3` for the third. Create the three members from those variables, then apply exactly this training so the output lines up:

- member 1: `train()` twice, then `mission()` once
- member 2: `mission()` once
- member 3: `train()` four times (this pushes past 100, so you see the cap)

Finally print all three. The fourth `train()` on member 3 is what triggers the cap in action

**Example** — Tommy (Boss, 3 years) trained twice and sent on one mission, Lance (Partner, 5 years) sent on one mission, Phil (Gunsmith, 2 years) trained four times

```text
Tommy Vercetti (Boss, 3 years) - Respect: 90
Lance Vance (Partner, 5 years) - Respect: 60
Phil Cassidy (Gunsmith, 2 years) - Respect: 100
```
