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
        // Reduce target's health by this.attackPower
        // Print: "NAME attacks TARGET for DAMAGE damage!"

    }

    void printStatus() {
        // Print: "NAME - HP: HEALTH"

    }
}

class Warrior extends Character {
    int armor;

    // Constructor: name, health, attackPower, armor
    Warrior(String name, int health, int attackPower, int armor) {
        super(name, health, attackPower);
        this.armor = armor;
    }

    // Override attack: damage = attackPower
    // Print: "NAME swings sword at TARGET for DAMAGE damage!"

}

class Mage extends Character {
    int spellPower;

    // Constructor: name, health, attackPower, spellPower
    Mage(String name, int health, int attackPower, int spellPower) {
        super(name, health, attackPower);
        this.spellPower = spellPower;
    }

    // Override attack: damage = attackPower + spellPower
    // Print: "NAME casts spell on TARGET for DAMAGE damage!"

}

public class Main {
    public static void main(String[] args) {
        // Create Warrior "Tommy": health 100, attack 25, armor 10
        // Create Mage "Lance": health 80, attack 15, spellPower 20

        // Tommy attacks Lance, print Lance's status
        // Lance attacks Tommy, print Tommy's status

    }
}