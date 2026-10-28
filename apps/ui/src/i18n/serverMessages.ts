import i18next from 'i18next';

// The API speaks English only. What it says to a student (an error, a run
// stopped) is shown on a Romanian page in Romanian from here, word for word by
// the server's sentence; serverMessages.test.ts fails when the server gains a
// sentence this doesn't know. Anything else stays as the server wrote it.
const RO: Record<string, string> = {
  // accounts and sign-in
  'User created successfully': 'Contul a fost creat',
  'Login successful': 'Te-ai conectat',
  'Logged out successfully': 'Te-ai deconectat',
  'If that email exists, a reset code was sent':
    'Dacă adresa există, ți-am trimis un cod de resetare',
  'Password reset successfully': 'Parola a fost schimbată',
  'User already exists': 'Există deja un cont cu acest email',
  'Invalid email or password': 'Email sau parolă greșită',
  'Too many attempts, try again later': 'Prea multe încercări, încearcă mai târziu',
  'This code has expired or used up its attempts, ask for a new one':
    'Codul a expirat sau și-a epuizat încercările, cere unul nou',
  'Too many codes asked for this email, try again later':
    'Ai cerut prea multe coduri pentru acest email, încearcă mai târziu',
  'No token provided': 'Nu ești conectat',
  'Invalid token': 'Sesiunea a expirat. Conectează-te din nou.',
  'Admin access required': 'E nevoie de acces de admin',
  'Name is required': 'Numele este obligatoriu',
  'Name must be at most 100 characters': 'Numele poate avea cel mult 100 de caractere',
  'Name has invalid characters': 'Numele conține caractere invalide',
  'Please enter a valid email address': 'Scrie o adresă de email validă',
  'Email must be at most 255 characters': 'Emailul poate avea cel mult 255 de caractere',
  'Password is too short, must be at least 6 characters':
    'Parola e prea scurtă, trebuie să aibă cel puțin 6 caractere',
  'Password must be at most 255 characters': 'Parola poate avea cel mult 255 de caractere',
  'Password is required': 'Parola este obligatorie',
  'Code must be 6 digits': 'Codul trebuie să aibă 6 cifre',
  // profile and settings
  'No file uploaded': 'Nu ai încărcat niciun fișier',
  'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.':
    'Tip de fișier nepermis. Merg doar JPEG, PNG, WebP și GIF.',
  'User not found': 'Utilizatorul nu există',
  'Current password is incorrect': 'Parola actuală este greșită',
  'Current password is required': 'Parola actuală este obligatorie',
  'New email is the same as the current one': 'Noul email este același cu cel actual',
  'Email is already in use': 'Emailul este deja folosit',
  'No pending email change': 'Nu ai nicio schimbare de email în așteptare',
  'Invalid or expired code': 'Cod greșit sau expirat',
  'Profile updated': 'Profilul a fost actualizat',
  'Avatar removed': 'Avatarul a fost șters',
  'Password updated': 'Parola a fost schimbată',
  'Confirmation code sent': 'Ți-am trimis codul de confirmare',
  'Email updated': 'Emailul a fost schimbat',
  'Pending email change cancelled': 'Schimbarea de email a fost anulată',
  'Invalid user ID': 'Utilizator invalid',
  'Invalid user id': 'Utilizator invalid',
  // forum
  'Only moderators and admins can manage categories':
    'Doar moderatorii și adminii pot gestiona categoriile',
  'Category not found': 'Categoria nu există',
  'Invalid thread ID': 'Discuție invalidă',
  'Thread not found': 'Discuția nu există',
  'Only moderators and admins can post in this category':
    'Doar moderatorii și adminii pot scrie în această categorie',
  'Thread is locked': 'Discuția este blocată',
  'Invalid post ID': 'Postare invalidă',
  'Post not found': 'Postarea nu există',
  'Cannot react to a deleted post': 'Nu poți reacționa la o postare ștearsă',
  'Cannot mark a deleted post as solution': 'O postare ștearsă nu poate fi marcată ca soluție',
  'Only the thread author can mark a solution': 'Doar autorul discuției poate marca soluția',
  'You cannot edit this post': 'Nu poți edita această postare',
  'You cannot delete this post': 'Nu poți șterge această postare',
  'You cannot delete this thread': 'Nu poți șterge această discuție',
  'Only admins can change roles': 'Doar adminii pot schimba rolurile',
  'You cannot change your own role': 'Nu îți poți schimba propriul rol',
  'The founder cannot be modified': 'Fondatorul nu poate fi modificat',
  'Only the founder can manage admins': 'Doar fondatorul poate gestiona adminii',
  'Title is required': 'Titlul este obligatoriu',
  'Content is required': 'Conținutul este obligatoriu',
  'Description is required': 'Descrierea este obligatorie',
  'Icon is required': 'Iconița este obligatorie',
  'Color must be a hex value like #6C5CE7': 'Culoarea trebuie să fie un cod hex, ca #6C5CE7',
  'Group is required': 'Grupul este obligatoriu',
  // messages, connections and notifications
  'Invalid conversation ID': 'Conversație invalidă',
  'Invalid message ID': 'Mesaj invalid',
  'Conversation not found': 'Conversația nu există',
  'Cannot message yourself': 'Nu îți poți trimite mesaje ție',
  'Message not found': 'Mesajul nu există',
  'Cannot react to a deleted message': 'Nu poți reacționa la un mesaj șters',
  'Invalid connection ID': 'Conexiune invalidă',
  'Cannot connect with yourself': 'Nu te poți conecta cu tine',
  'Already connected': 'Sunteți deja conectați',
  'A request is already pending': 'Există deja o cerere în așteptare',
  'Request not found': 'Cererea nu există',
  'Connection not found': 'Conexiunea nu există',
  'Invalid notification ID': 'Notificare invalidă',
  'Announcement text is required': 'Textul anunțului este obligatoriu',
  'Announcement is too long (max 2000 chars)': 'Anunțul e prea lung (cel mult 2000 de caractere)',
  // support
  'Only admins can view all tickets': 'Doar adminii pot vedea toate tichetele',
  'Invalid ticket ID': 'Tichet invalid',
  'Ticket not found': 'Tichetul nu există',
  'Not authorized': 'Nu ai acces',
  'You can only close your own tickets': 'Poți închide doar tichetele tale',
  'Subject is required': 'Subiectul este obligatoriu',
  'Subject is too long (max 200 chars)': 'Subiectul e prea lung (cel mult 200 de caractere)',
  'Message is required': 'Mesajul este obligatoriu',
  // lessons, tests, the terminal and the tutor
  'Invalid course': 'Curs invalid',
  'Invalid language': 'Limbaj invalid',
  'Lesson not found': 'Lecția nu există',
  'No such lesson': 'Lecția nu există',
  'Code saved': 'Codul a fost salvat',
  'Access tracked': 'Vizita a fost înregistrată',
  'The judge is busy right now, please try again in a moment':
    'Evaluatorul e ocupat acum, încearcă din nou peste câteva clipe',
  'The server is busy right now, please try again in a moment':
    'Serverul e ocupat acum, încearcă din nou peste câteva clipe',
  'Test run failed, please try again': 'Testele n-au putut rula, încearcă din nou',
  'This lesson has no tests': 'Lecția aceasta nu are teste',
  'A run is already in progress': 'O rulare e deja în curs',
  'Could not start the runner. Please try again.': 'Nu am putut porni rularea. Încearcă din nou.',
  'Invalid submission id': 'Încercare invalidă',
  'Submission not found': 'Încercarea nu există',
  'Solution not found': 'Soluția nu există',
  // Laniakea
  'Planet not found': 'Planeta nu există',
  'Laniakea is still locked': 'Laniakea e încă închisă',
  'Finish this lesson to reach its planet': 'Termină lecția ca să ajungi la planeta ei',
  'This planet has no questions yet': 'Planeta asta nu are încă întrebări',
  'This planet opens for another try soon': 'Planeta se deschide curând pentru o nouă încercare',
  'This test is over': 'Testul s-a încheiat',
  'Answer the questions in order': 'Răspunde la întrebări în ordine',
  'Invalid session ID': 'Sesiune invalidă',
  'Session not found': 'Sesiunea nu există',
  'Command too long': 'Comanda e prea lungă',
  'A command is already running in this session': 'O comandă rulează deja în această sesiune',
  'Too many guest runs from your network right now. Try again in a minute, or sign in.':
    'Prea multe rulări fără cont din rețeaua ta acum. Încearcă peste un minut sau conectează-te.',
  'Command failed': 'Comanda a eșuat',
  'Could not check your work, please try again':
    'Nu am putut verifica ce ai făcut, încearcă din nou',
  'No such conversation': 'Conversația nu există',
  'Work needs a lesson': 'Codul se trimite doar dintr-o lecție',
  'The tutor is not available right now': 'Tutorul nu e disponibil acum',
  // anything else
  'Not found': 'Nu există',
  'Invalid request body': 'Cerere invalidă',
  'Internal server error': 'Eroare pe server. Încearcă din nou.',
  'Something went wrong': 'Ceva n-a mers. Încearcă din nou.',
};

// What the server prints in a run's output when it stops or refuses one. Kept
// apart, so a program printing "Not found" keeps its own words.
const RUN_RO: Record<string, string> = {
  'Language not supported.': 'Limbaj nesuportat.',
  'Run cancelled': 'Rularea a fost anulată',
  'Language not supported': 'Limbaj nesuportat',
  'A run is already in progress.': 'O rulare e deja în curs.',
  'Could not prepare the run.': 'Nu am putut pregăti rularea.',
  'Internal error.': 'Eroare internă.',
  'Time limit exceeded (20s), program stopped.': 'Timpul a expirat (20s), programul a fost oprit.',
  'Output limit exceeded, program stopped.': 'Programul a afișat prea mult și a fost oprit.',
  'Program stopped to make room for others: the server is full right now. Run it again in a moment.':
    'Programul a fost oprit ca să facă loc altora: serverul e plin acum. Rulează-l din nou peste câteva clipe.',
  'Too many runs in progress, wait for one to finish.':
    'Prea multe rulări în curs, așteaptă să se termine una.',
  'The server is busy right now, please try again in a moment.':
    'Serverul e ocupat acum, încearcă din nou peste câteva clipe.',
  'Too many guest runs from your network right now. Try again in a minute, or sign in.':
    'Prea multe rulări fără cont din rețeaua ta acum. Încearcă peste un minut sau conectează-te.',
};

// The sentences the server fills in, by their shape
const RO_SHAPES: [RegExp, (...parts: string[]) => string][] = [
  [
    /^Too many attempts, try again in (\d+)s\.$/,
    (s) => `Prea multe încercări, mai încearcă peste ${s} s.`,
  ],
  [
    /^Rate limit: max (\d+) runs per minute\. Try again in (\d+)s\.$/,
    (max, s) => `Cel mult ${max} rulări pe minut. Mai încearcă peste ${s} s.`,
  ],
  [
    /^You have used all (\d+) free runs\. Create a free account to keep running code\.$/,
    (n) =>
      `Ai folosit toate cele ${n} rulări gratuite. Fă-ți un cont gratuit ca să rulezi cod în continuare.`,
  ],
];

// A spent limit names its refill time as an ISO date; any page shows it as a
// day and an hour in its own language
const LIMIT = /^Limit reached\. It refills at (\S+)$/;

function refillMessage(iso: string, lang: string): string {
  const when = new Date(iso).toLocaleString(lang, {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
  return i18next.getFixedT(lang)('usage.limitReached', { when });
}

function fromShape(line: string): string | null {
  for (const [shape, words] of RO_SHAPES) {
    const match = shape.exec(line);
    if (match) return words(...match.slice(1));
  }
  return null;
}

// A message from the server as the page should show it
export function localizeServerMessage(message: string, lang = i18next.language): string {
  const limit = LIMIT.exec(message);
  if (limit) return refillMessage(limit[1], lang);
  if (lang !== 'ro') return message;
  return RO[message] ?? fromShape(message) ?? message;
}

// A piece of a run's output: the server's own lines in the page's language,
// the program's as they are
export function localizeRunOutput(data: string, lang = i18next.language): string {
  if (lang !== 'ro') return data;
  return data
    .split('\n')
    .map((line) => RUN_RO[line] ?? fromShape(line) ?? line)
    .join('\n');
}

// For serverMessages.test.ts: the sentences translated word for word
export const translatedSentences = [...Object.keys(RO), ...Object.keys(RUN_RO)];
