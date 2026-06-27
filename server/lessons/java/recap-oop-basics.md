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

In `main`, create a few members, train them and send them on missions however you like, then print them. Train one member enough times to go past 100, so you can see the cap in action

**Example** — Tommy (Boss, 3 years) trained twice and sent on one mission, Lance (Partner, 5 years) sent on one mission, Phil (Gunsmith, 2 years) trained four times

```text
Tommy Vercetti (Boss, 3 years) - Respect: 90
Lance Vance (Partner, 5 years) - Respect: 60
Phil Cassidy (Gunsmith, 2 years) - Respect: 100
```
