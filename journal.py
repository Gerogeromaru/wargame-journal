#!/usr/bin/env python3
"""Wargame Journal - 練習サイト(OverTheWire等)の攻略記録ツール

データの正は data/journal.json。
このCLIで追記/更新し、site/data.js を再生成して閲覧ページに反映する。

使い方の例:
  python journal.py list                      # サイト/ゲーム/レベルの一覧
  python journal.py list --game bandit        # bandit のレベル進捗
  python journal.py add-step --game bandit --level 14-15 \
      --cmd "nc localhost 30000" --note "..."  # レベルに手順を1つ追加
  python journal.py set-level --game bandit --level 14-15 \
      --title "..." --goal "..." --status done --date 2026-06-17 --tags nc,network
  python journal.py add-takeaway --game bandit --level 14-15 --text "..."
  python journal.py add-game --site overthewire --id natas --name Natas \
      --url https://overthewire.org/wargames/natas/ --desc "Web基礎"
  python journal.py render                     # site/data.js を作り直す
  python journal.py open                        # render + ブラウザで開く
"""
import argparse
import datetime
import json
import os
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(ROOT, "data", "journal.json")
# docs/ は GitHub Pages の配信元（ローカルでも file:// で開ける閲覧ページ）
SITE_DIR = os.path.join(ROOT, "docs")
DATA_JS = os.path.join(SITE_DIR, "data.js")
INDEX_HTML = os.path.join(SITE_DIR, "index.html")

STATUS_CHOICES = ["todo", "in_progress", "done"]


def load():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save(data):
    data.setdefault("meta", {})["updated"] = datetime.date.today().isoformat()
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    render(data)


def render(data=None):
    """site/data.js を再生成（HTMLはfetchせずこの変数を読む＝サーバ不要）。"""
    if data is None:
        data = load()
    os.makedirs(SITE_DIR, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write("// 自動生成ファイル。手で編集しない（data/journal.json が正）。\n")
        f.write("window.JOURNAL_DATA = " + payload + ";\n")


def find_site(data, site_id):
    for s in data["sites"]:
        if s["id"] == site_id:
            return s
    return None


def find_game(data, game_id, site_id=None):
    for s in data["sites"]:
        if site_id and s["id"] != site_id:
            continue
        for g in s.get("games", []):
            if g["id"] == game_id:
                return s, g
    return None, None


def find_level(game, level_id):
    for lv in game.get("levels", []):
        if lv["id"] == level_id:
            return lv
    return None


def parse_level_id(level_id):
    """'12-13' -> (12, 13) を推測。失敗時は (None, None)。"""
    try:
        a, b = level_id.split("-", 1)
        return int(a), int(b)
    except Exception:
        return None, None


def cmd_list(args):
    data = load()
    for s in data["sites"]:
        print(f"# {s['name']}  ({s['id']})")
        for g in s.get("games", []):
            if args.game and g["id"] != args.game:
                continue
            lvs = g.get("levels", [])
            done = sum(1 for lv in lvs if lv.get("status") == "done")
            print(f"  - {g['name']} ({g['id']})  進捗 {done}/{len(lvs)}")
            if args.game:
                for lv in lvs:
                    mark = {"done": "[x]", "in_progress": "[~]", "todo": "[ ]"}.get(lv.get("status"), "[ ]")
                    boss = " ★" if lv.get("boss") else ""
                    print(f"      {mark} {lv['id']}  {lv.get('title','')}{boss}")


def cmd_add_site(args):
    data = load()
    if find_site(data, args.id):
        print(f"既に存在: site {args.id}")
        return
    data["sites"].append({"id": args.id, "name": args.name, "url": args.url or "", "games": []})
    save(data)
    print(f"追加: site {args.id}")


def cmd_add_game(args):
    data = load()
    s = find_site(data, args.site)
    if not s:
        print(f"サイトが無い: {args.site}")
        sys.exit(1)
    if find_game(data, args.id, args.site)[1]:
        print(f"既に存在: game {args.id}")
        return
    s.setdefault("games", []).append({
        "id": args.id, "name": args.name, "url": args.url or "",
        "description": args.desc or "", "connect": args.connect or "", "levels": []
    })
    save(data)
    print(f"追加: game {args.id} (site {args.site})")


def _ensure_level(data, game_id, level_id):
    s, g = find_game(data, game_id)
    if not g:
        print(f"ゲームが無い: {game_id}")
        sys.exit(1)
    lv = find_level(g, level_id)
    if lv is None:
        a, b = parse_level_id(level_id)
        lv = {"id": level_id, "from": a, "to": b, "title": "", "goal": "",
              "status": "in_progress", "date": datetime.date.today().isoformat(),
              "boss": False, "tags": [], "steps": [], "takeaways": []}
        g.setdefault("levels", []).append(lv)
    return g, lv


def cmd_set_level(args):
    data = load()
    g, lv = _ensure_level(data, args.game, args.level)
    if args.title is not None:
        lv["title"] = args.title
    if args.goal is not None:
        lv["goal"] = args.goal
    if args.status is not None:
        lv["status"] = args.status
    if args.date is not None:
        lv["date"] = args.date
    if args.boss is not None:
        lv["boss"] = (args.boss == "true")
    if args.tags is not None:
        lv["tags"] = [t.strip() for t in args.tags.split(",") if t.strip()]
    save(data)
    print(f"更新: {args.game} {args.level}")


def cmd_add_step(args):
    data = load()
    g, lv = _ensure_level(data, args.game, args.level)
    lv.setdefault("steps", []).append({"cmd": args.cmd, "note": args.note or ""})
    save(data)
    print(f"手順追加: {args.game} {args.level}  ({len(lv['steps'])}件目)")


def cmd_add_takeaway(args):
    data = load()
    g, lv = _ensure_level(data, args.game, args.level)
    lv.setdefault("takeaways", []).append(args.text)
    save(data)
    print(f"学び追加: {args.game} {args.level}")


def cmd_render(args):
    render()
    print(f"生成: {DATA_JS}")


def cmd_open(args):
    render()
    url = "file:///" + INDEX_HTML.replace("\\", "/")
    print(f"開く: {url}")
    webbrowser.open(url)


def build_parser():
    p = argparse.ArgumentParser(description="Wargame Journal CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    sp = sub.add_parser("list", help="一覧表示")
    sp.add_argument("--game")
    sp.set_defaults(func=cmd_list)

    sp = sub.add_parser("add-site")
    sp.add_argument("--id", required=True)
    sp.add_argument("--name", required=True)
    sp.add_argument("--url")
    sp.set_defaults(func=cmd_add_site)

    sp = sub.add_parser("add-game")
    sp.add_argument("--site", required=True)
    sp.add_argument("--id", required=True)
    sp.add_argument("--name", required=True)
    sp.add_argument("--url")
    sp.add_argument("--desc")
    sp.add_argument("--connect")
    sp.set_defaults(func=cmd_add_game)

    sp = sub.add_parser("set-level", help="レベルを作成/更新")
    sp.add_argument("--game", required=True)
    sp.add_argument("--level", required=True)
    sp.add_argument("--title")
    sp.add_argument("--goal")
    sp.add_argument("--status", choices=STATUS_CHOICES)
    sp.add_argument("--date")
    sp.add_argument("--boss", choices=["true", "false"])
    sp.add_argument("--tags", help="カンマ区切り")
    sp.set_defaults(func=cmd_set_level)

    sp = sub.add_parser("add-step", help="手順(コマンド＋解説)を追加")
    sp.add_argument("--game", required=True)
    sp.add_argument("--level", required=True)
    sp.add_argument("--cmd", required=True)
    sp.add_argument("--note")
    sp.set_defaults(func=cmd_add_step)

    sp = sub.add_parser("add-takeaway", help="学びを追加")
    sp.add_argument("--game", required=True)
    sp.add_argument("--level", required=True)
    sp.add_argument("--text", required=True)
    sp.set_defaults(func=cmd_add_takeaway)

    sp = sub.add_parser("render", help="site/data.js を再生成")
    sp.set_defaults(func=cmd_render)

    sp = sub.add_parser("open", help="render してブラウザで開く")
    sp.set_defaults(func=cmd_open)

    return p


def main():
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
