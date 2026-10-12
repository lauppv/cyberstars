public class Main {
    static class Character {
        final String name;
        int health;
        final int attackPower;

        Character(String n, int h, int a) {
            name = n;
            health = h;
            attackPower = a;
        }

        void attack(Character target) {
            target.health -= attackPower;
            System.out.printf("%s attacks %s for %d damage!%n", name, target.name, attackPower);
        }

        void printStatus() {
            System.out.printf("%s - HP: %d%n", name, health);
        }
    }

    static class Warrior extends Character {
        final int armor;

        Warrior(String n, int h, int a, int armor) {
            super(n, h, a);
            this.armor = armor;
        }

        @Override
        void attack(Character target) {
            target.health -= attackPower;
            System.out.printf("%s swings sword at %s for %d damage!%n", name, target.name, attackPower);
        }
    }

    static class Mage extends Character {
        final int spellPower;

        Mage(String n, int h, int a, int s) {
            super(n, h, a);
            spellPower = s;
        }

        @Override
        void attack(Character target) {
            int hit = attackPower + spellPower;
            target.health -= hit;
            System.out.printf("%s casts spell on %s for %d damage!%n", name, target.name, hit);
        }
    }

    public static void main(String[] args) {
        String name2 = "Lance";
        int health2 = 80;
        int attack2 = 15;
        int spell2 = 20;
        String name1 = "Tommy";
        int health1 = 100;
        int attack1 = 25;
        int armor1 = 10;
        Warrior warrior = new Warrior(name1, health1, attack1, armor1);
        Mage mage = new Mage(name2, health2, attack2, spell2);
        warrior.attack(mage);
        mage.printStatus();
        mage.attack(warrior);
        warrior.printStatus();
    }
}
