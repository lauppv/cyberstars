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
