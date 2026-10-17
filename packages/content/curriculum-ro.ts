// Lesson and challenge titles in Romanian, by course and slug. The static-
// content generator puts each one beside its English title in curriculum.json
// as `titleRo`; a lesson without one shows its English title. A challenge keeps
// its English difficulty in front ("Easy · "), which the list turns into a pill.
// Names a programmer uses as they are stay in English: commands, keywords and
// well-known algorithms or problems (pwd, for, Bubble Sort, Two Sum).

export const lessonTitlesRo: Record<string, Record<string, string>> = {
  python: {
    for: 'Bucle for',
    'recap-dicts': 'Recapitulare: Raport de la Centrul de Control',
    'pattern-counter': 'Tipar: contorul',
    'bubble-sort': 'Bubble Sort',
    'try-except': 'Try / Except',
  },
  c: {
    pointers: 'Pointeri',
    'malloc-free': 'Memorie dinamică',
    'file-io': 'Lucrul cu fișiere',
    'os-fork': 'SO: fork',
    'recap-control-flow': 'Recapitulare: FizzBuzz',
  },
  java: {
    'classes-objects': 'Clase și obiecte',
    'static-keyword': 'Cuvântul cheie static',
    'inheritance-override': 'Suprascrierea metodelor',
    tostring: 'toString()',
    'project-battle': 'Proiect: Simulator de luptă',
  },
  linux: {
    'what-is-terminal': 'Ce este un terminal?',
    pwd: 'pwd: unde mă aflu?',
    pipe: 'Pipe-ul: |',
    sed: 'Caută și înlocuiește: sed',
    'recap-permissions': 'Recapitulare: încuie tot',
  },
  'trees-graphs': {
    trees: 'Arbori',
    'tree-traversals': 'Parcurgeri în adâncime',
    heaps: 'Heap-uri',
    'breadth-first-search': 'Parcurgerea în lățime',
    'shortest-paths': 'Drumuri minime cu costuri',
  },
  'algo-python': {
    'reverse-string': 'Easy · Inversează un string',
    'caesar-cipher': 'Medium · Cifrul lui Cezar',
    'two-sum': 'Medium · Two Sum',
    fizzbuzz: 'Easy · FizzBuzz',
    'matrix-spiral': 'Hard · Matricea în spirală',
  },
  'algo-java': {
    'bank-account': 'Easy · Cont bancar',
    'stack-impl': 'Medium · Implementează o stivă',
    'comparable-sort': 'Medium · Sortează studenții',
    'bubble-sort': 'Medium · Bubble Sort',
    'generic-pair': 'Hard · Pereche generică',
  },
  'algo-c': {
    'reverse-array': 'Easy · Inversează un array',
    'gcd-lcm': 'Easy · CMMDC și CMMMC',
    'fork-two-pids': 'Easy · Două PID-uri',
    'merge-sort': 'Hard · Merge Sort',
    'sem-producer-consumer': 'Hard · Producător-consumator cu semafoare',
  },
  'algo-trees-graphs': {
    'max-depth': 'Easy · Adâncimea maximă a unui arbore',
    'count-islands': 'Easy · Numără insulele',
    'bst-lca': 'Medium · Cel mai apropiat strămoș comun într-un arbore binar de căutare',
    'rotting-fruit': 'Medium · Minute până se strică toate fructele',
    'signal-time': 'Hard · În cât timp ajunge semnalul la toate turnurile',
  },
};
