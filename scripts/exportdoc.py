#!/usr/bin/env python3
"""Delad logik för /validate-doc och /export-doc.

Hanterar (1) innehålls-checksumma, (2) godkännande-tabellen (export-state.json)
och (3) batchUpdate-requesten för den synliga versionsstämpeln i Google-dokumentet.

Checksumman är grinden: den räknas över dokumentets brödtext med versionsstämpeln
borträknad, så att vår egen stämpel-skrivning aldrig självinvaliderar ett godkännande.
En redigering av innehållet ändrar checksumman → godkännandet clearas automatiskt.

Subkommandon:
  checksum <markdown_file>                  -> skriver sha256 över normaliserad brödtext
  status   <docId>                          -> skriver tabellraden som JSON (eller {})
  approve  <docId> --name --checksum --target --kind   -> bumpar version, approved=true
  verify   <docId> <checksum>               -> OK / REJECT (+ clearar approved vid mismatch)
  stamp    --doc <doc.json> --version N --timestamp "..."  -> batchUpdate-request på stdout
"""
import sys, os, re, json, hashlib, argparse, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, "export-state.json")

# Rader som matchar detta är den maskinhanterade versionsstämpeln, inte innehåll.
STAMP_RE = re.compile(r"^\s*Document version\s+\d+", re.IGNORECASE)


def normalize_body(text: str) -> str:
    """Whitespace-normaliserad brödtext utan versionsstämpel-rader."""
    out = []
    for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if STAMP_RE.match(line):
            continue
        out.append(line.rstrip())
    # trimma ledande/avslutande tomrader så ett extra radslut inte ändrar hashen
    while out and not out[0].strip():
        out.pop(0)
    while out and not out[-1].strip():
        out.pop()
    return "\n".join(out)


def checksum_of(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        body = normalize_body(f.read())
    return "sha256:" + hashlib.sha256(body.encode("utf-8")).hexdigest()


def load_state() -> dict:
    if not os.path.exists(STATE):
        return {"documents": {}}
    with open(STATE, encoding="utf-8") as f:
        return json.load(f)


def save_state(state: dict) -> None:
    with open(STATE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)
        f.write("\n")


def now_stamp() -> str:
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")


def cmd_checksum(args):
    print(checksum_of(args.file))


def cmd_status(args):
    entry = load_state()["documents"].get(args.docId, {})
    print(json.dumps(entry, ensure_ascii=False))


def cmd_approve(args):
    state = load_state()
    entry = state["documents"].get(args.docId, {})
    entry.update({
        "name": args.name,
        "checksum": args.checksum,
        "version": int(entry.get("version", 0)) + 1,
        "approvedAt": now_stamp(),
        "approved": True,
    })
    if args.target:
        entry["target"] = args.target
    if args.kind:
        entry["kind"] = args.kind
    state["documents"][args.docId] = entry
    save_state(state)
    print(json.dumps({"version": entry["version"], "approvedAt": entry["approvedAt"]}, ensure_ascii=False))


def cmd_verify(args):
    state = load_state()
    entry = state["documents"].get(args.docId)
    if not entry or not entry.get("approved"):
        print("REJECT: not approved — run /validate-doc")
        return
    if entry.get("checksum") != args.checksum:
        entry["approved"] = False  # clearas: innehållet har ändrats sedan godkännandet
        save_state(state)
        print(f"REJECT: changed since approval (was version {entry.get('version')}) — run /validate-doc")
        return
    print(f"OK: approved version {entry.get('version')} ({entry.get('approvedAt')}) -> {entry.get('target')}")


def cmd_stamp(args):
    """Bygg en batchUpdate-request som ersätter (eller infogar) versionsstämpeln längst ner."""
    with open(args.doc, encoding="utf-8") as f:
        doc = json.load(f)
    body = doc["body"]["content"]
    last_end = body[-1]["endIndex"]
    text = f"Document version {args.version} · {args.timestamp}"

    # Leta upp en befintlig stämpel-paragraf.
    found = None
    for el in body:
        p = el.get("paragraph")
        if not p:
            continue
        ptxt = "".join(r.get("textRun", {}).get("content", "") for r in p.get("elements", []))
        if STAMP_RE.match(ptxt):
            found = el
            break

    requests = []
    if found:
        s, e = found["startIndex"], found["endIndex"]
        # Ta bort den synliga texten men behåll paragrafens (ev. dokumentets sista) radslut.
        requests.append({"deleteContentRange": {"range": {"startIndex": s, "endIndex": e - 1}}})
        requests.append({"insertText": {"location": {"index": s}, "text": text}})
    else:
        # Ingen stämpel än: lägg till en ny rad före dokumentets sista radslut.
        requests.append({"insertText": {"location": {"index": last_end - 1}, "text": "\n" + text}})

    # ensure_ascii=True: '·' blir · så requesten överlever Windows-skalet på väg till gws.
    print(json.dumps({"requests": requests}, ensure_ascii=True))


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("checksum"); p.add_argument("file"); p.set_defaults(func=cmd_checksum)
    p = sub.add_parser("status"); p.add_argument("docId"); p.set_defaults(func=cmd_status)
    p = sub.add_parser("approve")
    p.add_argument("docId"); p.add_argument("--name", required=True); p.add_argument("--checksum", required=True)
    p.add_argument("--target", default=""); p.add_argument("--kind", default="")
    p.set_defaults(func=cmd_approve)
    p = sub.add_parser("verify"); p.add_argument("docId"); p.add_argument("checksum"); p.set_defaults(func=cmd_verify)
    p = sub.add_parser("stamp")
    p.add_argument("--doc", required=True); p.add_argument("--version", required=True); p.add_argument("--timestamp", required=True)
    p.set_defaults(func=cmd_stamp)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
