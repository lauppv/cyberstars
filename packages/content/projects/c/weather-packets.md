Small weather stations stand on hills around a national park. They work on a battery and a tiny radio, so every message must be as short as possible: each station sends its whole report as one number of 32 bits, with every measurement packed into a few of those bits. You will write, in C, the receiver at the park's office. It unpacks every report with bit operations, throws away the broken ones, keeps a summary for each station, and can also pack a report, to test new stations.

**How it works.** The program reads commands and answers each one at once. Here is a session as you see it in the output box when you run a finished program. Each command you type is followed by the answer:

```text
Receiver on
packet 399E0060
Packet 1 from station 3
0011 1001100111 1000000 00001100 000
Temperature 21.5 C, humidity 64%, wind 12 km/h
packet 359AC0F6
Packet 2 from station 3
0011 0101100110 1011000 00011110 110
Temperature -4.2 C, humidity 88%, wind 30 km/h
Raining
Battery low
packet 7BB8A028
Packet 3 from station 7
0111 1011101110 0010100 00000101 000
Temperature 35.0 C, humidity 20%, wind 5 km/h
packet 3A3E0000
Packet 4 from station 3
0011 1010001111 1000000 00000000 000
Temperature 25.5 C, humidity 64%, wind 0 km/h
packet 3A1C0001
Packet 5 from station 3
0011 1010000111 0000000 00000000 001
Rejected: sensor error
packet 7BBBC028
Packet 6 from station 7
0111 1011101110 1111000 00000101 000
Rejected: humidity 120
packet 399A4084
Packet 7 from station 3
0011 1001100110 1001000 00010000 100
Temperature 21.4 C, humidity 72%, wind 16 km/h
Raining
stations
Station 3: 4 packets, -4.2 to 25.5 C, rain in 2
Station 7: 1 packet, 35.0 to 35.0 C, rain in 0
encode 3 21.5 64 12 0 0
0x399E0060
encode 16 20 50 5 0 0
Out of range
encode 3 -4.2 88 30 1 1
0x359AC0F6
packet zz
Usage: packet <hex>
listen
Unknown command: listen
quit
Receiver off
```

The commands:

| Command                                                             | What it does                              |
| ------------------------------------------------------------------- | ----------------------------------------- |
| `packet <hex>`                                                      | receives a packet, written in hexadecimal |
| `stations`                                                          | a summary of each station                 |
| `encode <station> <temperature> <humidity> <wind> <rain> <battery>` | packs a report into a packet              |
| `quit`                                                              | ends the program                          |

Some words you will meet:

| Word        | What it means                                                                     |
| ----------- | --------------------------------------------------------------------------------- |
| bit         | one 0 or 1. A number of 32 bits has bit 31 on the left and bit 0 on the right     |
| field       | a group of bits that holds one measurement                                        |
| flag        | one bit that says yes (1) or no (0)                                               |
| mask        | a number with 1s where you want to keep bits: `p & mask` keeps only those         |
| hexadecimal | numbers written with 16 digits: `0` to `9`, then `A` to `F`. Each digit is 4 bits |

**To try your program**, press Run and type the commands in the output box, one on each line. `quit` ends the program.

Build the program one step at a time, in one C file. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests send other packets. Passing them finishes the project.

## The packet

A packet is 32 bits. These are its fields:

| Bits     | What they hold                                   |
| -------- | ------------------------------------------------ |
| 31 to 28 | the station's number, 0 to 15                    |
| 27 to 18 | the temperature, in tenths of a degree, plus 400 |
| 17 to 11 | the humidity, in percent                         |
| 10 to 3  | the wind speed, in km/h                          |
| 2        | 1 when it is raining                             |
| 1        | 1 when the battery is low                        |
| 0        | 1 when a sensor is broken                        |

Print `Receiver on` at the start. Then read commands until someone types `quit`, and print `Receiver off` then. Read each command word with `scanf("%s", cmd)`, and use `strcmp` to see which one it is. For any other word, print `Unknown command: listen` and skip the rest of its line with `scanf("%*[^\n]")`.

## Receive a packet

`packet <hex>` receives a packet written in hexadecimal, like `399E0060`. `scanf("%x", &p)` reads it into an `unsigned int`. Use unsigned numbers for everything in this project: then shifting to the right never brings in a sign bit.

Number the packets from 1. Print which packet it is and which station sent it, then its 32 bits, with a space between the fields:

```text
packet 399E0060
Packet 1 from station 3
0011 1001100111 1000000 00001100 000
```

Bit `b` of `p` is `(p >> b) & 1`. For the station, shift the packet 28 bits to the right: only the four bits on the left are left.

## Temperature, humidity, wind

A field in the middle of the packet comes out in two moves. First shift it down to bit 0, then keep only its bits with a mask. The temperature has 10 bits, so its mask is `0x3FF` (ten 1s): `(p >> 18) & 0x3FF`. Then take away 400 and divide by ten.

Humidity has 7 bits and wind has 8, so work out their masks the same way.

```text
Temperature 21.5 C, humidity 64%, wind 12 km/h
```

Print temperatures with one decimal. Remember that `%` must be written `%%` in `printf`.

## Flags

The three lowest bits are flags. `p & 4` is not zero exactly when bit 2 is 1. After the measurements, print one line for each flag that is 1:

```text
packet 359AC0F6
Packet 2 from station 3
0011 0101100110 1011000 00011110 110
Temperature -4.2 C, humidity 88%, wind 30 km/h
Raining
Battery low
```

## Broken packets

A radio message can arrive broken, and a sensor can stop working. After printing the bits, say no to a packet when:

- its humidity is over 100: `Rejected: humidity 120`
- its sensor bit (bit 0) is 1: `Rejected: sensor error`

Check them in this order. Then print no measurements and keep nothing of the packet. A rejected packet still gets its number.

## Station summary

`stations` lists every station that sent at least one good packet, by number. For each one: how many good packets, its lowest and highest temperature, and how many packets said it was raining:

```text
stations
Station 3: 4 packets, -4.2 to 25.5 C, rain in 2
Station 7: 1 packet, 35.0 to 35.0 C, rain in 0
```

Before any good packet, print `No packets yet`. There can be only 16 stations, so an array of 16 structs, one for each station number, is enough.

## Pack a report

To test new stations, the office packs reports the other way. `encode <station> <temperature> <humidity> <wind> <rain> <battery>` builds the packet and prints it in hexadecimal with eight digits (`0x%08X`):

```text
encode 3 21.5 64 12 0 0
0x399E0060
encode 3 -4.2 88 30 1 1
0x359AC0F6
```

Turn the temperature into tenths plus 400, rounded to the nearest tenth. Then shift each field up to its place with `<<`, and put them together with `|`.

A value too big or too small for its field prints `Out of range`: a station above 15, a temperature below -40.0 or above 62.3, a humidity above 100, a wind above 255, or a flag that is not 0 or 1.

Give the hexadecimal you got back to `packet` (with the `0x` or without it: `%x` takes both), and the same values come out.

Last, two wrong commands:

- a `packet` without a hexadecimal number prints `Usage: packet <hex>`
- an `encode` without six numbers prints `Usage: encode <station> <temperature> <humidity> <wind> <rain> <battery>`
