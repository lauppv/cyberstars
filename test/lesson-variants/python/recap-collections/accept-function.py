items = ["milk", "bread", "con-eggs", "cheese", "con-yogurt", "butter", "jam"]


def sort_supplies(crates):
    kept = []
    for c in crates:
        if c[:4] != "con-":
            kept = kept + [c]
            if c == "butter":
                return kept
    return kept


clean = sort_supplies(items)
print("\n".join(clean + [f"Total: {len(clean)}"]))
