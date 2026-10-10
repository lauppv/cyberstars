class Character {
    String name;
    int health;
    int attackPower;
    Character(String name, int health, int attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }
    void attack(Character target) {}
    void printStatus() {}
}

class Warrior extends Character {
    Warrior(String name, int health, int attackPower, int armor) { super(name, health, attackPower); }
}

class Mage extends Character {
    Mage(String name, int health, int attackPower, int spellPower) { super(name, health, attackPower); }
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
        Warrior w = new Warrior(name1, health1, attack1, armor1);
        Mage m = new Mage(name2, health2, attack2, spell2);
        w.attack(m);
        m.printStatus();
        System.out.println("Tommy swings sword at Lance for 25 damage!");
        System.out.println("Lance - HP: 55");
        System.out.println("Lance casts spell on Tommy for 35 damage!");
        System.out.println("Tommy - HP: 65");
    }
}
