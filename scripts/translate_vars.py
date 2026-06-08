#!/usr/bin/env python3
"""Translate English variable names to Romanian in Python course files.

Processes .md files (only inside ```py blocks) and -code.md files (entire file).
Uses word-boundary matching to avoid partial replacements.
All Romanian identifiers follow Python snake_case convention.
"""

import os
import re

RO_DIR = os.path.join(os.path.dirname(__file__), '..', 'server', 'lessons', 'python', 'ro')

REPLACEMENTS = [
    # === Function names ===
    ("binarySearchRecursive", "cautare_binara_recursiva"),
    ("isPalindromeSentence", "este_palindrom_propozitie"),
    ("is_palindrome", "este_palindrom"),
    ("isPalindrome", "este_palindrom"),
    ("selection_sort", "sortare_selectie"),
    ("bubble_sort", "sortare_bule"),
    ("binary_search", "cautare_binara"),
    ("linearSearch", "cautare_liniara"),
    ("binarySearch", "cautare_binara"),
    ("removeDuplicates", "eliminaDuplicatele"),
    ("are_anagrams", "sunt_anagrame"),
    ("grade_quiz", "noteaza_test"),
    ("check_guess", "verifica_ghicirea"),
    ("find_crew", "gaseste_echipaj"),
    ("split_codes", "desparte_coduri"),
    ("count_codes", "numara_coduri"),
    ("most_common", "cel_mai_frecvent"),
    ("clean_text", "curata_text"),
    ("safe_int", "int_sigur"),
    ("give_hints", "da_indicii"),
    ("has_duplicate", "are_duplicate"),
    ("count_beacons", "numara_balize"),
    ("flatten_sorted", "aplatizeaza_sortat"),
    ("find_value", "gaseste_valoare"),
    ("reverse_text", "inverseaza_text"),
    ("pair_with_sum", "pereche_cu_suma"),
    ("sum_digits", "suma_cifre"),
    ("reverseStr", "inverseaza_sir"),
    ("countChar", "numara_caractere"),
    ("add_task", "adauga_sarcina"),
    ("addTask", "adauga_sarcina"),
    ("complete_task", "finalizeaza_sarcina"),
    ("completeTask", "finalizeaza_sarcina"),
    ("count_done", "numara_finalizate"),
    ("removeTask", "elimina_sarcina"),
    ("displayTodos", "afiseaza_sarcini"),
    ("countDone", "numara_finalizate"),
    ("countNotDone", "numara_nefinalizate"),
    ("createPlayer", "creaza_jucator"),
    ("playerStats", "statistici_jucator"),
    ("player_answers", "raspunsuri_jucator"),
    ("playGame", "joaca_joc"),
    ("runQuiz", "ruleaza_test"),
    ("addAndPrint", "adauga_si_afiseaza"),
    ("minMax", "minim_maxim"),
    ("myFunction", "functia_mea"),
    ("isAnagram", "este_anagrama"),
    ("twoSum", "doua_numere"),
    ("takeDamage", "primeste_damage"),
    ("summarize", "sumeaza"),
    ("highest", "cel_mai_mare"),
    ("analyze", "analizeaza"),
    ("divide", "imparte"),
    ("greet", "saluta"),
    ("parse", "analizeaza"),
    ("flatten", "aplatizeaza"),
    ("countdown", "numaratoare_inversa"),
    ("factorial", "factorial"),
    ("sumList", "suma_lista"),
    ("dock", "andocheaza"),
    ("boost", "amplifica"),
    ("power", "putere"),

    # === Boolean-prefixed variables ===
    ("isLoggedIn", "este_autentificat"),
    ("isEmployee", "este_angajat"),
    ("isWorkingDay", "este_zi_lucratoare"),
    ("isUserOnline", "este_utilizator_online"),
    ("isGuest", "este_oaspete"),
    ("isAlive", "este_viu"),
    ("isAdult", "este_adult"),
    ("isVIP", "este_vip"),
    ("isOnline", "este_online"),
    ("is_3d", "este_3d"),
    ("errorDetected", "eroare_detectata"),
    ("crewAboard", "echipaj_la_bord"),
    ("hasLicense", "are_permis"),
    ("hasInvitation", "are_invitatie"),
    ("hasFailure", "are_esuat"),
    ("allPassed", "toate_promovate"),
    ("allEven", "toate_pare"),
    ("hasKey", "are_cheie"),
    ("hasUpper", "are_majuscula"),
    ("hasLower", "are_minuscula"),
    ("hasDigit", "are_cifra"),
    ("has_upper", "are_majuscula"),
    ("has_digit", "are_cifra"),

    # === Multi-word variables ===
    ("secretNumber", "numar_secret"),
    ("maxAttempts", "maxim_incercari"),
    ("nextYear", "anul_urmator"),
    ("evenCount", "numar_pare"),
    ("upperCount", "numar_majuscule"),
    ("bestKey", "cea_mai_buna_cheie"),
    ("bestCount", "cel_mai_bun_numar"),
    ("sortedItems", "elemente_sortate"),
    ("numeOnline", "nume_conectati"),
    ("reversed_str", "sir_inversat"),
    ("empty_dict", "dict_gol"),
    ("empty_set", "set_gol"),
    ("bannedPlayers", "jucatori_banati"),
    ("minIndex", "index_minim"),
    ("currentSum", "suma_curenta"),
    ("maxPower", "putere_maxima"),
    ("windSpeed", "viteza_vant"),
    ("boostStep", "pas_amplificare"),
    ("phoneBook", "agenda_telefonica"),
    ("gameMap", "harta_joc"),
    ("mySet", "setul_meu"),
    ("myDict", "dictul_meu"),
    ("number1", "numar1"),
    ("number2", "numar2"),
    ("sorted_list", "lista_sortata"),
    ("celMaiBunCuvant", "cel_mai_bun_cuvant"),
    ("numeComplet", "nume_complet"),
    ("numeFamilie", "nume_familie"),

    # === Common variable names ===
    ("signals", "semnale"),
    ("signal", "semnal"),
    ("prices", "preturi"),
    ("price", "pret"),
    ("discounted", "redus"),
    ("doubled", "dublat"),
    ("withTax", "cu_taxa"),
    ("boosted", "amplificat"),
    ("cleaned", "curatat"),
    ("guesses", "ghiciri"),
    ("guess", "ghicire"),
    ("attempts", "incercari"),
    ("attempt", "incercare"),
    ("readings", "citiri"),
    ("reading", "citire"),
    ("players", "jucatori"),
    ("player", "jucator"),
    ("queries", "interogari"),
    ("enrollments", "inscrieri"),
    ("crew", "echipaj"),
    ("questions", "intrebari"),
    ("question", "intrebare"),
    ("answers", "raspunsuri"),
    ("answer", "raspuns"),
    ("options", "optiuni"),
    ("option", "optiune"),
    ("messages", "mesaje"),
    ("message", "mesaj"),
    ("results", "rezultate"),
    ("result", "rezultat"),
    ("items", "elemente"),
    ("item", "element"),
    ("tasks", "sarcini"),
    ("task", "sarcina"),
    ("teams", "echipe"),
    ("team", "echipa"),
    ("counts", "numere"),
    ("counter", "contor"),
    ("codes", "coduri"),
    ("code", "cod"),
    ("rows", "randuri"),
    ("row", "rand"),
    ("cols", "coloane"),
    ("col", "coloana"),
    ("weapons", "arme"),
    ("heroes", "eroi"),
    ("hero", "erou"),
    ("guests", "oaspeti"),
    ("birthday", "zi_de_nastere"),
    ("coordinates", "coordonate"),
    ("commands", "comenzi"),
    ("command", "comanda"),
    ("scores", "scoruri"),
    ("score", "scor"),
    ("checks", "verificari"),
    ("flags", "fanioane"),
    ("flag", "fanion"),
    ("steps", "pasi"),
    ("step", "pas"),
    ("shields", "scuturi"),
    ("shield", "scut"),
    ("fuel", "combustibil"),
    ("oxygen", "oxigen"),
    ("charge", "incarcare"),
    ("drain", "consum"),
    ("secret", "numar_secret"),
    ("status", "stare"),
    ("health", "viata"),
    ("speed", "viteza"),
    ("guild", "breasla"),
    ("level", "nivel"),
    ("temp", "temperatura"),
    ("hp", "viata"),
    ("base", "baza"),
    ("exp", "exponent"),
    ("fallback", "valoare_implicita"),
    ("strengths", "puncte_tari"),
    ("priority", "prioritate"),
    ("systems", "sisteme"),
    ("fuel", "combustibil"),
    ("fuels", "combustibili"),
    ("course", "curs"),
    ("seconds", "secunde"),
    ("spaces", "spatii"),
    ("letters", "litere"),
    ("digits", "cifre"),
    ("doilea", "secund"),
    ("matrix", "matrice"),
    ("grid", "grila"),
    ("biggest", "cel_mai_mare"),
    ("largest", "cel_mai_mare"),
    ("smallest", "cel_mai_mic"),
    ("average", "medie"),
    ("original", "original"),
    ("product", "produs"),
    ("parts", "parti"),
    ("unique", "unice"),
    ("evens", "pare"),
    ("passed", "promovate"),
    ("upper", "majuscule"),
    ("flat", "plat"),
    ("walls", "ziduri"),
    ("cell", "celula"),
    ("cargo", "incarcatura"),
    ("percentage", "procent"),
    ("mission", "misiune"),
    ("commander", "comandant"),
    ("engineer", "inginer"),
    ("params", "parametri"),
    ("param", "parametru"),
    ("index", "index"),
    ("tankA", "rezervor_a"),
    ("tankB", "rezervor_b"),
    ("tankC", "rezervor_c"),
    ("first", "primul"),
    ("second", "secund"),
    ("last", "ultimul"),
    ("best", "cel_mai_bun"),
    ("left", "stanga"),
    ("right", "dreapta"),
    ("mid", "mijloc"),
    ("char", "caracter"),
    ("die1", "zar1"),
    ("die2", "zar2"),
    ("team_a", "echipa_a"),
    ("team_b", "echipa_b"),

    # === Short generic names ===
    ("name", "nume"),
    ("age", "varsta"),
    ("size", "marime"),
    ("top", "varf"),
    ("key", "cheie"),
    ("value", "valoare"),
    ("data", "date"),
    ("text", "text"),
    ("total", "total"),
    ("min", "minim"),
    ("max", "maxim"),
    ("avg", "medie"),
    ("add", "adauga"),

    # === Dict keys in code ===
    ('"average"', '"medie"'),
    ('"passing"', '"promovare"'),
    ('"role"', '"rol"'),
    ('"options"', '"optiuni"'),
    ('"answer"', '"raspuns"'),
    ('"text"', '"text"'),
    ('"weapons"', '"arme"'),
    ('"health"', '"viata"'),
    ('"online"', '"conectat"'),
    ('"isAlive"', '"este_viu"'),
    ('"done"', '"finalizat"'),
]


def apply_replacements(text):
    """Apply all replacements using word-boundary matching."""
    ordered = sorted(REPLACEMENTS, key=lambda p: len(p[0]), reverse=True)
    for old, new in ordered:
        text = re.sub(r'\b' + re.escape(old) + r'\b', new, text)
    return text


def process_md_file(filepath):
    """Translate only inside ```py … ``` blocks."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    result = []
    in_block = False
    for line in lines:
        s = line.strip()
        if s.startswith('```py') or s == '```python':
            in_block = True
            result.append(line)
        elif s.startswith('```') and in_block:
            in_block = False
            result.append(line)
        elif in_block:
            result.append(apply_replacements(line))
        else:
            result.append(line)
    return ''.join(result)


def process_code_file(filepath):
    """Translate the entire file (starter-code files are just Python)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return apply_replacements(content)


def main():
    root = os.path.abspath(RO_DIR)
    if not os.path.isdir(root):
        print(f"Error: {root} not found")
        return 1

    all_files = sorted(os.listdir(root))
    md_files = [f for f in all_files if f.endswith('.md') and not f.endswith('-code.md')]
    code_files = [f for f in all_files if f.endswith('-code.md')]

    total_modified = 0
    total_changes = 0

    for fname in md_files:
        fpath = os.path.join(root, fname)
        new = process_md_file(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            old = f.read()
        if old != new:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new)
            total_modified += 1
            total_changes += sum(1 for o, n in zip(old.split(), new.split()) if o != n)
            print(f"  M  {fname}")

    for fname in code_files:
        fpath = os.path.join(root, fname)
        new = process_code_file(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            old = f.read()
        if old != new:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new)
            total_modified += 1
            total_changes += sum(1 for o, n in zip(old.split(), new.split()) if o != n)
            print(f"  M  {fname}")

    print(f"\nModified {total_modified} files (~{total_changes} token-level changes).")
    return 0


if __name__ == '__main__':
    exit(main())
