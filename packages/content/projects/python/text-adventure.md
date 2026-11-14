Your little cousin Ethan loves old text adventure games: you type `go north`, and the computer tells you what you see. He drew his own game on paper: a bakery at night, a locked cellar, and a recipe to save. He wants to play it on a computer, and next week he will draw another one.

So you won't write his bakery into the program. You will write a game engine: a program that reads any world from its input and lets you play in it.

**The input** starts with the world. Here is Ethan's bakery:

```text
5
kitchen|Kitchen
Flour covers every table. The oven is still warm.
exits: north=hall, east=pantry
items: none
pantry|Pantry
Shelves of jam jars, and a lamp on a hook.
exits: west=kitchen
items: lamp
hall|Hall
A long hall with portraits of old bakers.
exits: south=kitchen, down=cellar, west=shop
items: key
cellar|Cellar
Sacks of flour, and a dusty recipe book on a barrel.
exits: up=hall
items: recipe
shop|Shop
The front of the bakery. The street door is right here.
exits: east=hall
items: none
1
hall down key
dark: cellar
goal: recipe shop
start kitchen
```

After the world, the player types commands. Here is a whole game, as you see it in the output box when you run a finished program. The commands the player types and the game's answers come one after the other:

```text
World of 5 rooms
== Kitchen ==
Flour covers every table. The oven is still warm.
Exits: east, north
go north
== Hall ==
A long hall with portraits of old bakers.
Exits: down, south, west
You see: key
go down
The way down is locked.
take key
You take the key.
unlock down
You unlock the way down with the key.
go south
== Kitchen ==
Flour covers every table. The oven is still warm.
Exits: east, north
go east
== Pantry ==
Shelves of jam jars, and a lamp on a hook.
Exits: west
You see: lamp
take lamp
You take the lamp.
go west
== Kitchen ==
Flour covers every table. The oven is still warm.
Exits: east, north
go north
== Hall ==
A long hall with portraits of old bakers.
Exits: down, south, west
go down
== Cellar ==
Sacks of flour, and a dusty recipe book on a barrel.
Exits: up
You see: recipe
take recipe
You take the recipe.
go up
== Hall ==
A long hall with portraits of old bakers.
Exits: down, south, west
go west
== Shop ==
The front of the bakery. The street door is right here.
Exits: east
You made it! It took you 8 moves.
```

Some words you will meet:

| Word      | What it means                                                  |
| --------- | -------------------------------------------------------------- |
| room      | a place in the world, like the kitchen                         |
| exit      | a way out of a room, in a direction: `north`, `down`, ...      |
| item      | a thing that lies in a room and can be picked up, like the key |
| inventory | the items the player carries                                   |
| goal      | the item to bring, and the room to bring it to, to win         |

The commands:

| Command              | What it does                            |
| -------------------- | --------------------------------------- |
| `look`               | describes the room again                |
| `go <direction>`     | goes through an exit                    |
| `take <item>`        | picks up an item                        |
| `drop <item>`        | puts an item down in the room           |
| `inventory`          | shows what the player carries           |
| `unlock <direction>` | opens a locked exit with the right item |
| `quit`               | ends the game                           |

**To try your program**, press Run and paste the world in the output box. Then type commands to play.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think the game works, press **Run Tests**: the tests play Ethan's bakery and other worlds. Passing them finishes the project.

## Read the world

The world comes in this order:

1. how many rooms there are
2. four lines for each room: its id and name (`kitchen|Kitchen`), its description, its exits, and the items in it
3. the locked exits: how many, then one on each line: the room, the direction, and the item that opens it (`hall down key`)
4. the dark rooms (`dark: cellar`)
5. the goal: an item, and the room to bring it to (`goal: recipe shop`)
6. the room where the player starts (`start kitchen`)

A list of exits, items or dark rooms can be `none`.

Keep the world in dictionaries. Find each room by its id, and keep its name, its description, a dictionary of its exits (direction to room id) and a list of its items. When the world is read, print `World of 5 rooms`. Every line after that is a command from the player.

## Look around

The game starts by describing the room the player is in, and `look` describes it again:

```text
== Kitchen ==
Flour covers every table. The oven is still warm.
Exits: east, north
```

Sort the exits by direction, from A to Z. When there are items in the room, add one more line with them, in the order they lie there: `You see: lamp`. A room with no exits says `Exits: none`.

Then read commands until the player types `quit`, and print `Bye` then. For a command the game doesn't know, print `I don't understand that.`. Skip empty lines.

## Walk around

`go <direction>` takes the player through an exit and describes the new room, as `look` does. When the room has no exit in that direction, print `You can't go that way.` and the player stays.

Count every move that works: you need the count at the end.

## Pick things up

- `take <item>` picks up an item in the room: `You take the key.`, or `There is no key here.` when it isn't there
- `drop <item>` puts an item from the inventory down in the room: `You drop the key.`, or `You don't have a key.`
- `inventory` lists what the player carries, in the order they picked it up: `You carry: key, lamp`, or `You carry: nothing`

A dropped item stays in its new room, at the end of the room's list.

## Locked passages

A locked exit can't be used until it is opened with the right item. `go` through it prints `The way down is locked.`, and the player stays.

`unlock <direction>` opens it when the player carries the item:

```text
unlock down
You need the key.
take key
You take the key.
unlock down
You unlock the way down with the key.
```

When that exit is not locked, print `Nothing is locked down.`. An exit stays open after it is unlocked, even if the player drops the key.

## Dark rooms

In a dark room the player sees nothing, unless they carry the `lamp`. Then `look`, or going into the room, prints only the name and this line:

```text
== Cellar ==
It is too dark to see.
```

In the dark, `take` prints `You can't see anything to take.` The player can still walk out of a dark room: they remember the way they came.

## Win the game

The player wins when they walk into the goal room carrying the goal item. After the room's description, print how many moves it took. The game ends right there:

```text
go west
== Shop ==
The front of the bakery. The street door is right here.
Exits: east
You made it! It took you 8 moves.
```

For one move, write `1 move`. Now draw Ethan a world of your own and see if he can win it.
