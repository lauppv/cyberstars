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
    }

    void printStatus() {
    }
}

class Warrior extends Character {
    int armor;

    Warrior(String name, int health, int attackPower, int armor) {
        super(name, health, attackPower);
        this.armor = armor;
    }
}

class Mage extends Character {
    int spellPower;

    Mage(String name, int health, int attackPower, int spellPower) {
        super(name, health, attackPower);
        this.spellPower = spellPower;
    }
}

public class Main {
    public static void main(String[] args) {



    }
}
