Let's build something fun — a **battle simulator**! Think of it like a turn-based combat system from an RPG. We'll have characters with health and attack power, plus subclasses for Warriors and Mages with their own special abilities. This project uses **inheritance**, **methods**, and **OOP** all working together

---

**Step 1: The Character base class**

Every character has a **name**, **health**, and **attackPower**. They can also **attack** another character

```java
class Character {
    String name;
    int health;
    int attackPower;

    Character(String name, int health, int attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    void attack(Character target) {
        target.health -= this.attackPower;
        System.out.println(this.name + " attacks " + target.name + " for " + this.attackPower + " damage!");
    }

    void printStatus() {
        System.out.println(this.name + " - HP: " + this.health);
    }
}
```

The `attack` method reduces the target's health by the attacker's power. Simple and effective — like a basic melee hit in Vice City

---

**Step 2: The Warrior subclass**

A Warrior has bonus **armor** that reduces incoming damage. We override the parent's fields and add damage reduction logic. When a Warrior gets attacked, the armor absorbs some damage

```java
class Warrior extends Character {
    int armor;

    Warrior(String name, int health, int attackPower, int armor) {
        super(name, health, attackPower);
        this.armor = armor;
    }

    void attack(Character target) {
        int damage = this.attackPower;
        target.health -= damage;
        System.out.println(this.name + " swings sword at " + target.name + " for " + damage + " damage!");
    }
}
```

The Warrior's attack method overrides the parent's to print a more specific message. The `super(...)` call sets up the base Character fields

---

**Step 3: The Mage subclass**

A Mage has **spellPower** — their magic does extra damage on top of their base attack

```java
class Mage extends Character {
    int spellPower;

    Mage(String name, int health, int attackPower, int spellPower) {
        super(name, health, attackPower);
        this.spellPower = spellPower;
    }

    void attack(Character target) {
        int damage = this.attackPower + this.spellPower;
        target.health -= damage;
        System.out.println(this.name + " casts spell on " + target.name + " for " + damage + " damage!");
    }
}
```

The Mage's attack combines base attackPower and spellPower for bigger hits. Glass cannon style — lots of damage, but typically less health than a Warrior

---

**Putting it all together**

```java
class Character {
    String name;
    int health;
    int attackPower;

    Character(String name, int health, int attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    void attack(Character target) {
        target.health -= this.attackPower;
        System.out.println(this.name + " attacks " + target.name + " for " + this.attackPower + " damage!");
    }

    void printStatus() {
        System.out.println(this.name + " - HP: " + this.health);
    }
}

class Warrior extends Character {
    int armor;

    Warrior(String name, int health, int attackPower, int armor) {
        super(name, health, attackPower);
        this.armor = armor;
    }

    void attack(Character target) {
        int damage = this.attackPower;
        target.health -= damage;
        System.out.println(this.name + " swings sword at " + target.name + " for " + damage + " damage!");
    }
}

class Mage extends Character {
    int spellPower;

    Mage(String name, int health, int attackPower, int spellPower) {
        super(name, health, attackPower);
        this.spellPower = spellPower;
    }

    void attack(Character target) {
        int damage = this.attackPower + this.spellPower;
        target.health -= damage;
        System.out.println(this.name + " casts spell on " + target.name + " for " + damage + " damage!");
    }
}

public class Main {
    public static void main(String[] args) {
        Warrior w = new Warrior("Tommy", 100, 25, 10);
        Mage m = new Mage("Lance", 80, 15, 20);

        w.attack(m);
        m.printStatus();

        m.attack(w);
        w.printStatus();
    }
}
```

Output

```text
Tommy swings sword at Lance for 25 damage!
Lance - HP: 55
Lance casts spell on Tommy for 35 damage!
Tommy - HP: 65
```

---

This is **polymorphism** in action — both Warrior and Mage ARE Characters, but they each attack differently. The `attack` method does different things depending on the actual type. In Vice City terms: Tommy punches hard (Warrior), while Lance uses sneaky tricks (Mage)

Notice how `printStatus()` is only defined once in the parent `Character` class, but both Warrior and Mage can use it. That's the power of inheritance — write it once, reuse everywhere

---

Your turn! Build the battle simulator:

1. Create a `Character` class with `name` (String), `health` (int), `attackPower` (int), a constructor, an `attack(Character target)` method, and a `printStatus()` method
2. Create a `Warrior` class extending Character with `armor` (int). Override attack to print: `"NAME swings sword at TARGET for DAMAGE damage!"` where damage equals attackPower
3. Create a `Mage` class extending Character with `spellPower` (int). Override attack to print: `"NAME casts spell on TARGET for DAMAGE damage!"` where damage equals attackPower + spellPower
4. `printStatus()` should print: `"NAME - HP: HEALTH"`
5. In main:
   - Create a Warrior: "Tommy", health 100, attackPower 25, armor 10
   - Create a Mage: "Lance", health 80, attackPower 15, spellPower 20
   - Tommy attacks Lance, then print Lance's status
   - Lance attacks Tommy, then print Tommy's status

Expected output:

```text
Tommy swings sword at Lance for 25 damage!
Lance - HP: 55
Lance casts spell on Tommy for 35 damage!
Tommy - HP: 65
```
