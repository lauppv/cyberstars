import { useState, useEffect } from "react";
import { Topbar } from "../components/layout/Topbar";
import "./AlmanacPage.css";

interface StoryData {
  emoji: string;
  tag?: string;
  catLabel?: string;
  year?: string;
  grad?: string;
  title: string;
  excerpt: string;
  fullText: string;
  author: string;
  authorEm?: string;
  authorEmoji?: string;
  readTime: string;
  xp: number;
  date?: string;
}

const CATEGORIES = [
  { id: "all", label: "All", em: "✦" },
  { id: "history", label: "History", em: "📜" },
  { id: "oss", label: "Open Source", em: "🐧" },
  { id: "legends", label: "Legends", em: "👑" },
  { id: "hardware", label: "Hardware", em: "💾" },
  { id: "internet", label: "Internet", em: "🌐" },
  { id: "ai", label: "AI & Future", em: "🧠" },
  { id: "fun", label: "Fun Facts", em: "🎲" },
];

const HERO = {
  cat: "oss",
  catLabel: "OPEN SOURCE",
  tag: "OPEN SOURCE",
  title: "How a 21-year-old in Helsinki accidentally changed the world",
  excerpt:
    'In August 1991, a Finnish student posted a humble message to a Usenet newsgroup: "I\'m doing a (free) operating system, just a hobby, won\'t be big and professional like gnu." Three decades later, Linux runs on 90% of the cloud, every Android phone, and the laptop you\'re reading this on.',
  fullText: `In the summer of 1991, Linus Torvalds was a 21-year-old computer science student at the University of Helsinki. He'd just bought a new PC with an Intel 386 processor, and he was frustrated. MINIX, the teaching OS he was using, couldn't do what he wanted. Commercial UNIX was far too expensive for a student.

So he started writing his own operating system kernel. Not because he wanted to change the world — he just wanted to use his modem and read Usenet newsgroups more comfortably.

On August 25, 1991, he posted a now-legendary message to comp.os.minix:

"Hello everybody out there using minix — I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu). This has been brewing since april, and is starting to get ready."

The response was immediate. Developers from around the world began contributing patches, drivers, and ideas. Within months, the project had its own mailing list and a growing community.

By choosing the GPL license (at the suggestion of others), Linus ensured that every improvement would be shared back. This created a virtuous cycle: more users meant more developers, which meant better hardware support, which meant more users.

Today, Linux runs on over 90% of cloud servers, every Android phone, most of the world's supercomputers, smart TVs, routers, cars, and even Mars rovers. The International Space Station runs Linux. The Large Hadron Collider runs Linux. Your WiFi router almost certainly runs Linux.

What started as a hobby project by a bored Finnish student became the backbone of modern computing — an ecosystem worth billions, built by millions of volunteers, all because one person decided to scratch an itch and share the result.`,
  author: "Editorial Team",
  authorEmoji: "✨",
  readTime: "8 min",
  date: "May 14, 2026",
  emoji: "🐧",
  xp: 30,
};

const ARTICLES = [
  {
    cat: "history",
    tag: "HISTORY",
    year: "1969",
    emoji: "📞",
    grad: "linear-gradient(135deg,#1a1a40,#3a1f70)",
    title: "The night the internet said its first word",
    excerpt:
      "On October 29, 1969, ARPANET sent its first message between UCLA and Stanford. They tried to send 'LOGIN' — the system crashed after 'LO'. Humanity's first internet message was an accidental 'lo'.",
    fullText: `The date was October 29, 1969. The place: Room 3420 at UCLA's Boelter Hall. A young programmer named Charley Kline sat at an SDS Sigma 7 computer, connected via a 50 kilobit per second line to a second machine at Stanford Research Institute, 350 miles away.

His task was simple: log in to the remote computer. He would type "LOGIN" and the Stanford machine would respond.

He typed "L". The system echoed it back. He typed "O". It echoed back. Then he typed "G" — and the entire system crashed.

The first message ever sent over what would become the internet was "LO". An accidental abbreviation that, in retrospect, seems almost poetic — as if the network was saying "hello" in its own broken way.

About an hour later, after the system was rebooted, Kline tried again. This time the full "LOGIN" went through. The ARPANET was alive.

The network had been funded by DARPA (the Defense Advanced Research Projects Agency) and designed by a team led by Larry Roberts and Bob Kahn. The original vision was to allow researchers at different universities to share expensive computing resources.

Nobody imagined it would become a global communication network connecting billions of people. The four original ARPANET nodes — UCLA, Stanford, UC Santa Barbara, and the University of Utah — were the seeds of what we now call the internet.

That two-letter "LO" is preserved in the IMP (Interface Message Processor) log at UCLA. It remains the most consequential typo in human history.`,
    author: "CyberBot",
    authorEm: "🤖",
    readTime: "5 min",
    xp: 20,
  },
  {
    cat: "legends",
    tag: "LEGENDS",
    year: "1843",
    emoji: "👑",
    grad: "linear-gradient(135deg,#3a1f4f,#8b1a5c)",
    title: "Ada Lovelace wrote code before computers existed",
    excerpt:
      "In 1843, a century before the first electronic computer, Ada Lovelace published an algorithm for computing Bernoulli numbers on a machine that was never built. She is the first programmer in history.",
    fullText: `Augusta Ada King, Countess of Lovelace, was born on December 10, 1815 — the only legitimate child of the poet Lord Byron, who left the family when Ada was a month old.

Her mother, Lady Byron, was determined that Ada would not inherit her father's "dangerous" poetic temperament. She insisted on a rigorous education in mathematics and science — unusual for women of the era.

It worked, but not the way her mother intended. Ada developed what she called "poetical science" — a visionary blend of imagination and mathematical rigor.

In 1833, at age 17, Ada met Charles Babbage at a party. Babbage had designed the Difference Engine, a mechanical calculator, and was working on something far more ambitious: the Analytical Engine, a general-purpose computing machine with memory, processing, and conditional branching.

Ada was fascinated. Over the next decade, she studied the Analytical Engine's designs in detail. In 1843, she published a translation of an Italian article about the Engine, adding her own extensive "Notes" that were three times longer than the original text.

In Note G, she described a step-by-step algorithm for computing Bernoulli numbers — a sequence important in number theory. This is widely regarded as the first computer program ever written.

But Ada saw something even bigger. While Babbage thought of his Engine as a number-crunching machine, Ada realized it could manipulate any symbols according to rules — not just numbers. She wrote: "The Engine might compose elaborate and scientific pieces of music of any degree of complexity."

She essentially predicted general-purpose computing, artificial creativity, and the relationship between hardware and software — 100 years before any of it existed.

Ada died of cancer in 1852, at age 36. The Analytical Engine was never built. But her vision was eventually proven right, and the U.S. Department of Defense named a programming language "Ada" in her honor in 1980.`,
    author: "Ms. Diana",
    authorEm: "🦄",
    readTime: "6 min",
    xp: 25,
  },
  {
    cat: "oss",
    tag: "OPEN SOURCE",
    year: "1985",
    emoji: "🦬",
    grad: "linear-gradient(135deg,#1f3a1f,#2d6b3d)",
    title: "Why Richard Stallman left MIT to start a revolution",
    excerpt:
      "After fighting with a printer driver he wasn't allowed to fix, Stallman quit MIT and started the GNU Project. He wrote a license that uses copyright to do the opposite: guarantee freedom.",
    fullText: `In the late 1970s, the AI Lab at MIT was a hacker paradise. Researchers shared code freely, improved each other's programs, and treated software like knowledge — something meant to flow.

Richard Stallman, a programmer at the lab, thrived in this culture. Then things changed.

The incident that radicalized him was surprisingly mundane: a printer. Xerox had donated a laser printer to the lab, but it jammed frequently. Stallman wanted to fix the driver software to notify users when their print job jammed — a simple quality-of-life hack.

But Xerox wouldn't share the source code. A researcher at Carnegie Mellon who had the code refused to share it too — he'd signed a non-disclosure agreement.

For Stallman, this was a betrayal of everything computing should be. Software was becoming proprietary. Companies were locking down code that researchers used to share freely. The hacker culture was dying.

In 1983, he announced the GNU Project — a plan to build a complete, free operating system. In 1985, he left MIT (so the university couldn't claim ownership of his work) and founded the Free Software Foundation.

His masterstroke was the GNU General Public License (GPL). Instead of abandoning copyright, the GPL uses copyright law to enforce freedom: you can use, modify, and share GPL software, but any derivative work must also be GPL. Stallman called this "copyleft."

By the early 1990s, GNU had produced essential tools — GCC (compiler), Emacs (editor), Bash (shell), and many utilities. The only missing piece was the kernel. When Linus Torvalds released his Linux kernel in 1991, it combined with the GNU tools to create a fully free operating system.

Stallman's principled stand — triggered by a jammed printer — had laid the foundation for the open-source revolution that now powers most of the world's technology.`,
    author: "Editorial",
    authorEm: "✨",
    readTime: "7 min",
    xp: 25,
  },
  {
    cat: "history",
    tag: "HISTORY",
    year: "1968",
    emoji: "🎤",
    grad: "linear-gradient(135deg,#0f1c3a,#2a4a8b)",
    title: "The Mother of All Demos — a 90-minute glimpse of the future",
    excerpt:
      "In 1968, Douglas Engelbart demoed the mouse, hypertext, video conferencing, real-time collaborative editing and windows — 16 years before the Mac. Most of the audience walked out confused.",
    fullText: `On December 9, 1968, at the Fall Joint Computer Conference in San Francisco, Douglas Engelbart and his team from the Stanford Research Institute gave a live demonstration that would later be called "The Mother of All Demos."

For 90 minutes, Engelbart showed technologies that wouldn't become mainstream for decades:

The computer mouse — a wooden block with two wheels that translated hand movement into cursor movement on screen. Nobody had seen anything like it.

Hypertext links — clickable text that jumped to related information. This was 1968 — 23 years before the World Wide Web.

Real-time collaborative editing — two people editing the same document simultaneously, with changes appearing on both screens in real time. Google Docs wouldn't offer this until 2006.

Video conferencing — Engelbart talked to a colleague at the lab 30 miles away, their faces visible on screen. Zoom wouldn't exist for another 43 years.

Windowed interfaces — multiple documents visible in separate areas of the screen. The Macintosh wouldn't ship until 1984.

The demo was technically stunning. Engelbart sat on stage with a custom keyboard, the mouse, and a large projected display, while his team operated the equipment back at the lab. The signal traveled over a dedicated microwave link.

But the audience's reaction was mixed. Many were amazed. Others walked out confused — the concepts were so far ahead of their time that people literally couldn't process what they were seeing. Some thought it was faked.

Engelbart's lab, the Augmentation Research Center, was eventually defunded. His researchers scattered to Xerox PARC and other labs, carrying his ideas with them. Those ideas became the foundation of personal computing.

Engelbart spent the rest of his life largely unrecognized by the mainstream. He received the National Medal of Technology in 2000, but by then the world had moved on. He died in 2013, aged 88.`,
    author: "Kai",
    authorEm: "🐺",
    readTime: "9 min",
    xp: 30,
  },
  {
    cat: "fun",
    tag: "FUN FACT",
    year: "1947",
    emoji: "🦟",
    grad: "linear-gradient(135deg,#3a2010,#8b5a1a)",
    title: "The first computer bug was a literal bug",
    excerpt:
      'September 9, 1947. The Mark II at Harvard malfunctioned. Engineers found a moth stuck in relay #70. They taped it into the logbook with a note: "First actual case of bug being found." Grace Hopper.',
    fullText: `On September 9, 1947, engineers working on the Harvard Mark II computer at the Naval Weapons Center in Dahlgren, Virginia, were running a routine test when the machine produced errors.

After hours of searching, they traced the problem to relay number 70, Panel F. There, wedged between the contacts, was a moth. The insect had shorted out the relay and caused the malfunction.

The operators carefully removed the moth with tweezers and taped it into the logbook, writing next to it: "First actual case of bug being found."

The word "bug" had actually been used for technical glitches since at least the 1870s — Thomas Edison used it in his notes. But this was the first time a literal bug caused a computer malfunction, making it a delightful coincidence.

Grace Hopper, who was part of the team working on the Mark II, loved telling this story. She often gets credit for coining the term "debugging," though she herself always said the term predated the incident. What she did was popularize the story — and it stuck.

The actual moth, still taped to the logbook page, is preserved at the Smithsonian National Museum of American History in Washington, D.C. It remains the most famous insect in computing history.

The term "debugging" — finding and fixing errors in code — is now so universal that most programmers never think about its entomological origins. Every time you debug your code, you're paying tribute to a moth that flew into the wrong relay 77 years ago.`,
    author: "CyberBot",
    authorEm: "🤖",
    readTime: "3 min",
    xp: 15,
  },
  {
    cat: "oss",
    tag: "OPEN SOURCE",
    year: "1996",
    emoji: "🐧",
    grad: "linear-gradient(135deg,#1a2a4f,#4f6fab)",
    title: "Why is Linux's mascot a penguin? (The pinching story)",
    excerpt:
      "In 1996 Linus needed a mascot. He told the community he'd been pecked by a penguin at a zoo in Canberra. The supposed pinch came with mild fever — and a lifelong fondness for the bird.",
    fullText: `In 1996, the Linux community decided it needed a mascot. The project was gaining serious momentum, and a recognizable logo would help.

Suggestions poured in — eagles, sharks, foxes, all the usual tech-mascot suspects. Then Linus Torvalds chimed in with an unusual preference: he wanted a penguin.

His reasoning? During a visit to the National Zoo & Aquarium in Canberra, Australia, he'd been nipped by a little penguin (Eudyptula minor, the world's smallest penguin species). The bite wasn't serious, but Linus joked that it gave him "penguinitis" — a made-up condition causing an irrational fondness for the birds.

He described his ideal mascot: a penguin that looked "happy and satisfied, like it had just eaten a whole herring." Not fierce, not corporate — just content.

Larry Ewing, a developer, created the image using GIMP (the GNU Image Manipulation Program — open source, of course). The result was Tux: a slightly pudgy, friendly-looking penguin sitting with a satisfied expression.

The name "Tux" has multiple claimed origins — some say it stands for "Torvalds UniX," others that it refers to the penguin's tuxedo-like coloring.

Tux became one of the most recognized mascots in technology. Unlike corporate logos designed by branding agencies, Tux was born from a personal anecdote, created with free software, and belongs to no one. It's the perfect mascot for Linux — informal, community-driven, and a little bit weird.`,
    author: "Liam",
    authorEm: "🐢",
    readTime: "4 min",
    xp: 15,
  },
  {
    cat: "hardware",
    tag: "HARDWARE",
    year: "1971",
    emoji: "🔲",
    grad: "linear-gradient(135deg,#2a1a40,#5a2f7a)",
    title: "The Intel 4004 — a CPU you could hold in your fingernail",
    excerpt:
      "The world's first commercial microprocessor (1971) had 2,300 transistors and ran at 740 kHz. The chip you're using right now has tens of billions of transistors and is 5 million times faster.",
    fullText: `In 1969, a Japanese calculator company called Busicom approached Intel to design a set of chips for a new calculator. They wanted 12 custom chips, each handling a different function.

Federico Faggin, Ted Hoff, and Stanley Mazor at Intel had a better idea: instead of 12 specialized chips, why not build one general-purpose processor that could be programmed to do everything?

The result, released on November 15, 1971, was the Intel 4004 — the world's first commercially available microprocessor.

The numbers seem laughable today: 2,300 transistors, a 4-bit architecture, running at 740 kHz. It could perform about 92,000 instructions per second. The chip was 3mm × 4mm — small enough to fit on a fingernail.

But the concept was revolutionary. Before the 4004, computers were built from boards full of discrete components. Each new design required custom hardware. The microprocessor changed this: now you could build different devices by simply writing different programs for the same chip.

To put the progress in perspective: a modern Apple M4 chip contains about 28 billion transistors and can perform trillions of operations per second. That's roughly 12 million times more transistors and several million times more computing power — packed into a chip that's only about 40 times larger in area.

Moore's Law — the observation that transistor counts double roughly every two years — has held remarkably steady since the 4004. But the real revolution wasn't the transistor count. It was the idea that a single, programmable chip could replace rooms full of specialized hardware.

The 4004 made computers small enough to put in anything. That idea led directly to personal computers, smartphones, smart watches, and the connected world we live in today.`,
    author: "Theo",
    authorEm: "🦝",
    readTime: "6 min",
    xp: 20,
  },
  {
    cat: "internet",
    tag: "INTERNET",
    year: "1991",
    emoji: "🌐",
    grad: "linear-gradient(135deg,#103a3a,#1f7a7a)",
    title: "Tim Berners-Lee gave the Web away — for free, forever",
    excerpt:
      "In 1993 CERN published the Web's source code into the public domain. Tim Berners-Lee never patented it. No royalties, no permissions. That single decision made the modern internet possible.",
    fullText: `In 1989, Tim Berners-Lee, a British physicist working at CERN (the European Organization for Nuclear Research), had a problem. Thousands of researchers at CERN produced data, papers, and documentation, but they used different computer systems that couldn't talk to each other. Finding information was a nightmare.

His solution was a proposal titled "Information Management: A Proposal." His boss's handwritten note on the cover page read: "Vague, but exciting."

By 1990, Berners-Lee had built the three fundamental technologies of the World Wide Web: HTML (the markup language for web pages), URI/URL (the addressing system), and HTTP (the communication protocol). He also built the first web browser and the first web server, running on a NeXT computer at CERN.

The first website, info.cern.ch, went live on December 20, 1990. It explained what the Web was and how to use it.

Here's where the story becomes remarkable. CERN could have patented the Web. Berners-Lee could have licensed it. The potential revenue would have been astronomical — every website, every web transaction, every online service would owe royalties.

Instead, on April 30, 1993, CERN released the Web's underlying code into the public domain. No patents. No royalties. No restrictions. Anyone, anywhere, could build on it for free.

Berners-Lee has been explicit about why: "Had the technology been proprietary, and in my total control, it would probably not have taken off. You can't propose that something be a universal space and at the same time keep control of it."

This single decision — to give the Web away — is arguably the most consequential act of generosity in technological history. It enabled the explosive growth of the internet, the creation of entire industries, and the transformation of human communication.

Berners-Lee was knighted in 2004 and received the Turing Award in 2016. But his greatest legacy is the thing he chose not to own.`,
    author: "Sam",
    authorEm: "🦉",
    readTime: "7 min",
    xp: 25,
  },
  {
    cat: "legends",
    tag: "LEGENDS",
    year: "1969",
    emoji: "🚀",
    grad: "linear-gradient(135deg,#1a1a2e,#16213e)",
    title: "Margaret Hamilton wrote the code that landed Apollo 11",
    excerpt:
      "Hamilton coined the term 'software engineering' because no one took her work seriously. Her code handled an overflow during the moon landing — caught the error, kept the priorities right, and Neil landed safely.",
    fullText: `In the 1960s, software wasn't taken seriously. Hardware was the real engineering — software was just the stuff you put on it. There was no computer science degree, no formal methodology, no discipline called "software engineering."

Margaret Hamilton changed that.

Hamilton was the lead software engineer for the Apollo program at MIT's Instrumentation Laboratory. She led the team that wrote the onboard flight software for the Apollo spacecraft — the code that would guide astronauts to the Moon and back.

She coined the term "software engineering" deliberately. She wanted people to treat software development with the same rigor as other engineering disciplines. Her colleagues laughed at first — but she was right.

The software Hamilton's team wrote was extraordinary. It used a priority-based scheduling system called an asynchronous executive. Multiple tasks could run concurrently, but the system would always prioritize the most critical ones.

This design proved crucial on July 20, 1969, during the Apollo 11 lunar landing. Three minutes before touchdown, the onboard computer started throwing "1202" and "1203" alarms. A rendezvous radar switch had been left in the wrong position, flooding the computer with unnecessary data.

A lesser system would have crashed. But Hamilton's software recognized the overflow, dumped the low-priority tasks, and kept running the essential landing programs. The computer was telling the astronauts: "I'm overloaded, but I've got the important stuff handled."

Mission Control, understanding the software's behavior, gave the go-ahead to continue. Neil Armstrong and Buzz Aldrin landed safely in the Sea of Tranquility.

After the mission, Hamilton's priority scheduling approach became a model for reliable software design. The concept of software that degrades gracefully under stress — rather than crashing — is now fundamental to every critical system, from aircraft to medical devices.

In 2016, President Obama awarded Hamilton the Presidential Medal of Freedom. The iconic photo of her standing next to a stack of Apollo code printouts as tall as she is has become a symbol of software engineering's importance.`,
    author: "Maya",
    authorEm: "🦊",
    readTime: "8 min",
    xp: 30,
  },
  {
    cat: "fun",
    tag: "FUN FACT",
    year: "1971",
    emoji: "@",
    grad: "linear-gradient(135deg,#3a1a3a,#7a2f6a)",
    title: "The @ symbol almost died — then email saved it",
    excerpt:
      "In 1971, Ray Tomlinson needed a character that separated user from machine. The @ was already on the keyboard and almost never used. One arbitrary choice and now it's on every email ever sent.",
    fullText: `The @ symbol has a long history before email. Medieval monks used it as an abbreviation for the Latin word "ad" (meaning "at" or "toward"). Merchants adopted it to mean "at the rate of" — as in "10 items @ $5 each."

By the 1960s, the @ symbol was nearly obsolete. It survived on typewriter keyboards mainly out of inertia — it had been there since the first Remington models, and nobody bothered to remove it. Most people never pressed the key.

Then, in 1971, Ray Tomlinson was working on ARPANET at BBN Technologies in Cambridge, Massachusetts. He was building a system to send messages between users on different computers — what we now call email.

He needed a separator between the user's name and the computer's name. The character had to be:
1. Not a letter or number (to avoid confusion with names)
2. Not already used in operating system commands
3. Already on the keyboard

Tomlinson looked at his Model 33 Teletype keyboard and chose @. It was already there, almost nobody used it, and it conveniently read as "at" — user AT machine.

The first email address was something like tomlinson@bbntenexa (the exact text is lost to history). Tomlinson sent a test message to himself between two computers sitting side by side.

He later said the content of the first email was "something like QWERTYUIOP" — a test string, not a carefully composed historic message. When asked about the significance, he told his colleague, "Don't tell anyone! This isn't what we're supposed to be working on."

Today, every email address in the world uses @. The symbol went from near-extinction to appearing billions of times a day — all because one engineer needed an arbitrary character and picked the quiet one gathering dust on his keyboard.`,
    author: "CyberBot",
    authorEm: "🤖",
    readTime: "4 min",
    xp: 15,
  },
  {
    cat: "ai",
    tag: "AI & FUTURE",
    year: "1950",
    emoji: "🧠",
    grad: "linear-gradient(135deg,#1a2a40,#4a3a7a)",
    title: "Turing asked one question that we're still trying to answer",
    excerpt:
      '"Can machines think?" Alan Turing\'s 1950 paper proposed a test: if you can\'t tell a computer from a human in conversation, does the difference matter? Seventy-six years later, we\'re still arguing.',
    fullText: `In 1950, Alan Turing published a paper titled "Computing Machinery and Intelligence" in the journal Mind. It opened with five words that would define an entire field: "Can machines think?"

Turing knew the question was tricky. What does "think" even mean? Instead of getting lost in philosophy, he proposed a practical test — what he called "The Imitation Game" (now known as the Turing Test).

The setup is simple: a human judge has text conversations with two hidden participants — one human, one machine. If the judge can't reliably tell which is which, the machine is said to have passed the test.

Turing predicted that by 2000, a computer with 128 MB of memory could fool 30% of judges in a five-minute conversation. This was remarkably prescient, though the timeline was optimistic.

In the paper, Turing anticipated and addressed virtually every objection that people still raise about AI today:

"Machines can't be creative." Turing argued that creativity might just be a form of computation we don't understand yet.

"Machines don't have consciousness." Turing asked: how do you know other humans are conscious? You can only judge from external behavior.

"Machines can only do what they're programmed to do." Turing pointed out that learning machines could develop behaviors their programmers never anticipated.

The Turing Test has been debated for 76 years. Critics say it only tests imitation, not understanding. Supporters say that sufficiently good imitation IS understanding — or at least, that we can't prove otherwise.

In 2024-2025, large language models began routinely passing informal versions of the Turing Test. Whether this means machines "think" remains as contested as ever. But the question Turing asked — and the framework he gave us for approaching it — remains the foundation of artificial intelligence.

Turing himself never saw any of this. He died in 1954, at age 41, after being prosecuted for homosexuality and subjected to chemical castration. The British government issued a formal apology in 2009, and a royal pardon in 2013.`,
    author: "Editorial",
    authorEm: "✨",
    readTime: "9 min",
    xp: 30,
  },
  {
    cat: "oss",
    tag: "OPEN SOURCE",
    year: "1999",
    emoji: "📕",
    grad: "linear-gradient(135deg,#3a1a1a,#7a2f2f)",
    title: "The Cathedral and the Bazaar — why open source actually works",
    excerpt:
      'Eric S. Raymond\'s 1999 essay explained why a chaotic crowd of volunteers can outpace polished corporate teams. "Given enough eyeballs, all bugs are shallow." It became the manifesto for an entire industry.',
    fullText: `In 1997, Eric S. Raymond published an essay that would reshape how the software industry thinks about development. "The Cathedral and the Bazaar" compared two models of software creation.

The Cathedral model was the traditional approach: a small team of experts works in isolation, carefully designing and building software before releasing polished versions to the public. Most commercial software — and even many open-source projects like GNU Emacs — followed this pattern.

The Bazaar model was what Raymond observed in the Linux kernel project: a chaotic, open process where anyone could contribute, releases happened constantly, and the code evolved through a messy but effective process of peer review and iteration.

Raymond expected the Bazaar approach to produce inferior software. Instead, he found the opposite. Linux was more reliable, more innovative, and faster-moving than Cathedral-style projects.

His key insight was Linus's Law: "Given enough eyeballs, all bugs are shallow." When thousands of people read your code, bugs that would take a small team weeks to find get spotted in hours.

But Raymond identified something deeper: the Bazaar model worked because it aligned incentives differently. Cathedral developers build what the plan says. Bazaar developers scratch their own itches — they fix bugs that annoy them, add features they need. This means contributions are motivated by genuine need, not corporate priorities.

The essay had enormous practical impact. It directly influenced Netscape's decision to release the Mozilla browser's source code in 1998 — one of the first major commercial open-source releases. This eventually led to Firefox.

It also inspired the creation of the "Open Source Initiative" and the term "open source" itself (as distinct from Stallman's "free software"). The essay gave business leaders a framework for understanding why giving away code could be a competitive advantage.

Today, open source is not just accepted — it's dominant. Microsoft, Google, Amazon, and virtually every major tech company both use and contribute to open-source projects. The Bazaar won.`,
    author: "Ms. Diana",
    authorEm: "🦄",
    readTime: "10 min",
    xp: 35,
  },
];

const FUN_FACTS = [
  {
    em: "🎮",
    text: 'The first video game, "Tennis for Two" (1958), ran on an analog oscilloscope at a science fair. The creator made it because the open house was boring.',
    src: "— Brookhaven Lab, 1958",
  },
  {
    em: "📼",
    text: 'Floppy disks were called "floppy" because the original 8-inch disks bent in your hand. The 3.5" disks we remember were technically rigid.',
    src: "— IBM, 1971",
  },
  {
    em: "🐍",
    text: "Python is named after Monty Python's Flying Circus, not the snake. Guido van Rossum was reading the scripts when he picked the name in 1991.",
    src: "— python.org",
  },
  {
    em: "⌨️",
    text: "The QWERTY layout was designed in 1873 to slow typists down — keys jammed on mechanical typewriters. We've kept it ever since.",
    src: "— Christopher Sholes",
  },
  {
    em: "☕",
    text: 'Java was almost called "Oak" — until lawyers found another product with that name. The team picked Java over coffee. Literally.',
    src: "— Sun Microsystems, 1995",
  },
  {
    em: "🦠",
    text: 'The first computer virus, "Creeper" (1971), just displayed: "I\'m the creeper, catch me if you can!" The first antivirus, "Reaper", was made to hunt it.',
    src: "— ARPANET",
  },
  {
    em: "🖱️",
    text: "The first computer mouse was made of wood (1964). Doug Engelbart's prototype had two perpendicular wheels — and one button.",
    src: "— SRI International",
  },
  {
    em: "💾",
    text: "The save icon (a floppy disk) is now older than most of the people who use it. Kids today have never touched one.",
    src: "— Universal truth",
  },
];

const ON_THIS_DAY = [
  { year: "1969", event: "UNIX first installed at Bell Labs by Ken Thompson" },
  {
    year: "1990",
    event: "Tim Berners-Lee proposes the World Wide Web at CERN",
  },
  { year: "2001", event: "First public release of Wikipedia" },
  { year: "2008", event: "Bitcoin whitepaper published by Satoshi Nakamoto" },
  { year: "2009", event: "The first Git commit was authored by Linus" },
  {
    year: "2022",
    event: "ChatGPT enters public beta — 1M users in 5 days",
  },
];

const LEGENDS = [
  { em: "🐧", name: "Linus Torvalds", desc: "Linux, Git — Finland, 1969" },
  { em: "🦬", name: "Richard Stallman", desc: "GNU, Free Software — 1953" },
  { em: "👑", name: "Ada Lovelace", desc: "First programmer — 1815" },
  { em: "🦋", name: "Grace Hopper", desc: "COBOL, first bug — 1906" },
  { em: "🚀", name: "Margaret Hamilton", desc: "Apollo 11 software — 1936" },
  { em: "🧠", name: "Alan Turing", desc: "Father of CS — 1912" },
  { em: "🌐", name: "Tim Berners-Lee", desc: "Invented the Web — 1955" },
  { em: "🍎", name: "Dennis Ritchie", desc: "Created C, UNIX — 1941" },
];

const QUOTE = {
  text: "Talk is cheap. Show me the code.",
  author: "Linus Torvalds",
  context: "2000, Linux Kernel Mailing List",
};

const BIG_TIMELINE = [
  {
    year: "1969",
    emoji: "📡",
    tag: "INTERNET",
    title: "ARPANET sends its first message",
    text: "UCLA → Stanford. They tried to send LOGIN, the system crashed after 'LO'. Humanity's first internet packet was a typo.",
  },
  {
    year: "1983",
    emoji: "🌐",
    tag: "PROTOCOLS",
    title: "The internet is born on a Tuesday",
    text: 'January 1, 1983 — ARPANET switches from NCP to TCP/IP. Networks of networks become possible. Vint Cerf calls it "Flag Day".',
  },
  {
    year: "1991",
    emoji: "🐧",
    tag: "OPEN SOURCE",
    title: "Linus posts to comp.os.minix",
    text: '"Hello everybody out there using minix — I\'m doing a (free) operating system (just a hobby, won\'t be big and professional like gnu)." It would become the most successful OS in history.',
  },
  {
    year: "1995",
    emoji: "☕",
    tag: "LANGUAGES",
    title: 'Java is released — "Write Once, Run Anywhere"',
    text: "Sun Microsystems ships Java 1.0. The JVM concept revolutionizes how we ship software. JavaScript is created the same year by Brendan Eich, in 10 days.",
  },
  {
    year: "2005",
    emoji: "🌳",
    tag: "TOOLS",
    title: "Linus writes Git in two weeks",
    text: "After BitKeeper revoked the Linux kernel's free license, Linus built a distributed version control system from scratch. He named it after himself: \"I'm an egotistical bastard.\"",
  },
  {
    year: "2007",
    emoji: "📱",
    tag: "PLATFORMS",
    title: "The iPhone redefines a computer",
    text: "A computer in your pocket, with no keyboard, running custom UNIX. Within a decade more code runs on phones than on every desktop ever made.",
  },
];

function StoryModal({
  story,
  onClose,
}: {
  story: StoryData;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="story-overlay" onMouseDown={onClose}>
      <div className="story-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="story-close" onClick={onClose}>
          ✕
        </button>
        <div className="story-modal-art">
          <div
            className="story-modal-art-grad"
            style={{
              background:
                story.grad ||
                "linear-gradient(135deg,#000814 0%,#001d3d 60%,#003566 100%)",
            }}
          />
          <span className="story-modal-emoji">{story.emoji}</span>
          {story.tag && <span className="story-modal-tag">{story.tag}</span>}
          {story.year && (
            <span className="story-modal-year">{story.year}</span>
          )}
        </div>
        <div className="story-modal-body">
          <h2 className="story-modal-title">{story.title}</h2>
          <div className="story-modal-meta">
            <div className="story-modal-author">
              <div className="story-modal-author-av">
                {story.authorEm || story.authorEmoji}
              </div>
              <span>{story.author}</span>
            </div>
            <span className="dot" />
            <span>{story.readTime} read</span>
            <span className="dot" />
            <span
              style={{
                color: "var(--accent)",
                fontFamily: "var(--mono)",
                fontWeight: 700,
              }}
            >
              +{story.xp} XP
            </span>
          </div>
          <div className="story-modal-text">
            {story.fullText.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlmanacPage() {
  const [filter, setFilter] = useState("all");
  const [factIdx, setFactIdx] = useState(0);
  const [openStory, setOpenStory] = useState<StoryData | null>(null);

  const filtered =
    filter === "all" ? ARTICLES : ARTICLES.filter((a) => a.cat === filter);
  const fact = FUN_FACTS[factIdx];

  const nextFact = () => setFactIdx((factIdx + 1) % FUN_FACTS.length);
  const prevFact = () =>
    setFactIdx((factIdx - 1 + FUN_FACTS.length) % FUN_FACTS.length);

  return (
    <>
      <Topbar />
      <main className="almanac-page">
        <div className="almanac-header">
          <div className="almanac-kicker">✦ The CyberStars Almanac</div>
          <h1 className="almanac-title">
            Stories that built
            <br />
            the modern world.
          </h1>
          <p className="almanac-subtitle">
            Tech history, open-source legends, hacker culture and the curious
            little stories behind the tools you use every day. New articles every
            week.
          </p>
        </div>

        <div className="almanac-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={
                "almanac-chip" + (filter === c.id ? " active" : "")
              }
              onClick={() => setFilter(c.id)}
            >
              <span className="chip-em">{c.em}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {filter === "all" && (
          <article className="almanac-hero" onClick={() => setOpenStory(HERO)}>
            <div className="hero-art">
              <div className="hero-art-bg" />
              <div className="hero-art-stars" />
              <div className="hero-art-icon">{HERO.emoji}</div>
              <div className="hero-art-badge">FEATURED STORY</div>
            </div>
            <div className="hero-content">
              <div className="hero-cat">✦ {HERO.catLabel}</div>
              <h2 className="hero-title">{HERO.title}</h2>
              <p className="hero-excerpt">{HERO.excerpt}</p>
              <div className="hero-meta">
                <div className="hero-author">
                  <div className="hero-author-avatar">{HERO.authorEmoji}</div>
                  <span>{HERO.author}</span>
                </div>
                <span className="dot" />
                <span>{HERO.date}</span>
                <span className="dot" />
                <span>{HERO.readTime} read</span>
                <span className="dot" />
                <span
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--mono)",
                    fontWeight: 700,
                  }}
                >
                  +{HERO.xp} XP
                </span>
              </div>
            </div>
          </article>
        )}

        <div className="almanac-grid">
          <div>
            <div className="section-head">
              <h2>Latest reads</h2>
              <div className="meta">
                {filtered.length}{" "}
                {filter === "all" ? "articles" : "in this topic"}
              </div>
            </div>
            <div className="almanac-articles">
              {filtered.map((a, i) => (
                <article className="almanac-article" key={i} onClick={() => setOpenStory(a)}>
                  <div className="article-art">
                    <div
                      className="article-art-grad"
                      style={{ background: a.grad }}
                    />
                    <span className="article-art-tag">{a.tag}</span>
                    <span className="article-art-year">{a.year}</span>
                    <span className="emoji">{a.emoji}</span>
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{a.title}</h3>
                    <p className="article-excerpt">{a.excerpt}</p>
                    <div className="article-footer">
                      <div className="article-author">
                        <div className="article-author-av">{a.authorEm}</div>
                        <span>{a.author}</span>
                      </div>
                      <div className="article-stats">
                        <span>{a.readTime}</span>
                        <span className="article-xp">+{a.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="almanac-sidebar">
            <div className="side-card factcard">
              <h3>🎲 Daily Fun Fact</h3>
              <span className="fact-emoji">{fact.em}</span>
              <div className="fact-text">{fact.text}</div>
              <div className="fact-source">{fact.src}</div>
              <div className="fact-nav">
                <div className="fact-pips">
                  {FUN_FACTS.map((_, i) => (
                    <div
                      key={i}
                      className={
                        "fact-pip" + (i === factIdx ? " active" : "")
                      }
                    />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="fact-btn" onClick={prevFact}>
                    ‹
                  </button>
                  <button className="fact-btn" onClick={nextFact}>
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="side-card">
              <h3>
                <span className="blip" /> On this day in tech
              </h3>
              <div className="timeline">
                {ON_THIS_DAY.map((it, i) => (
                  <div className="tl-item" key={i}>
                    <div className="tl-year">{it.year}</div>
                    <div className="tl-event">{it.event}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-card quote-card">
              <h3>💬 Quote of the day</h3>
              <div className="quote-mark">&ldquo;</div>
              <div className="quote-text">{QUOTE.text}</div>
              <div className="quote-author">
                — <strong>{QUOTE.author}</strong> &middot; {QUOTE.context}
              </div>
            </div>

            <div className="side-card">
              <h3>👑 Hall of Legends</h3>
              <div className="legends">
                {LEGENDS.map((l, i) => (
                  <div className="legend" key={i}>
                    <div className="legend-av">{l.em}</div>
                    <div className="legend-info">
                      <div className="legend-name">{l.name}</div>
                      <div className="legend-desc">{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="bigtl-section">
          <div className="section-head" style={{ marginBottom: 8 }}>
            <div>
              <div className="almanac-kicker" style={{ marginBottom: 6 }}>
                ⏳ The Timeline
              </div>
              <h2>Moments that bent the trajectory</h2>
            </div>
          </div>
          <div className="bigtl">
            {BIG_TIMELINE.map((m, i) => (
              <div className="bigtl-item" key={i}>
                <div className="bigtl-dot">{m.emoji}</div>
                <div className="bigtl-year">{m.year}</div>
                <h3 className="bigtl-title">{m.title}</h3>
                <p className="bigtl-text">{m.text}</p>
                <span className="bigtl-tag">{m.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {openStory && (
        <StoryModal story={openStory} onClose={() => setOpenStory(null)} />
      )}
    </>
  );
}
