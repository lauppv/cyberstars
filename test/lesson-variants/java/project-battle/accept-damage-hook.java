class Character {
    String name;
    int health;
    int attackPower;

    Character(String name, int health, int attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    int damage() {
        return attackPower;
    }

    String verb(Character target) {
        return "attacks " + target.name;
    }

    void attack(Character target) {
        int dmg = damage();
        target.health = target.health - dmg;
        System.out.println(name + " " + verb(target) + " for " + dmg + " damage!");
    }

    void printStatus() {
        System.out.println(name + " - HP: " + health);
    }
}

class Warrior extends Character {
    int armor;

    Warrior(String name, int health, int attackPower, int armor) {
        super(name, health, attackPower);
        this.armor = armor;
    }

    @Override
    String verb(Character target) {
        return "swings sword at " + target.name;
    }
}

class Mage extends Character {
    int spellPower;

    Mage(String name, int health, int attackPower, int spellPower) {
        super(name, health, attackPower);
        this.spellPower = spellPower;
    }

    @Override
    int damage() {
        return attackPower + spellPower;
    }

    @Override
    String verb(Character target) {
        return "casts spell on " + target.name;
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        int health1 = 100;
        int attack1 = 25;
        int armor1 = 10;
        String name2 = "Lance";
        int health2 = 80;
        int attack2 = 15;
        int spell2 = 20;

        Character tommy = new Warrior(name1, health1, attack1, armor1);
        Character lance = new Mage(name2, health2, attack2, spell2);
        tommy.attack(lance);
        lance.printStatus();
        lance.attack(tommy);
        tommy.printStatus();
    }
}
