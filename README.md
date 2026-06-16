# Wargame Journal

OverTheWire など練習サイトの攻略を「**各レベルで何をやったか・打ったコマンド・解説**」付きで記録する学習ジャーナル。
今は **Bandit** のみ。今後 Natas / Leviathan や他サイトを足していく。

パスワード控え（`first-project/pentest-bandit-progress.md`）とは役割分担：
- あちら = ログイン用パスワードの控え
- こちら = 学習記録（コマンド＋なぜそうするかの解説）

## 構成
```
wargame-journal/
  journal.py          CLI（追記・更新・一覧・起動）。Claudeが叩く道具
  data/journal.json   データの正（サイト→ゲーム→レベル→手順）
  docs/index.html     閲覧ページ（GitHub Pages配信元 & ローカルでも開ける）
  docs/style.css      見た目
  docs/app.js         描画ロジック
  docs/data.js        journal.json から自動生成（手で触らない）
```

## 使い方（閲覧）
- ローカル: `docs/index.html` をブラウザで開く、または `python journal.py open`
- スマホ/外出先: GitHub Pages の公開URL（Public + Pages /docs 配信）

GitHub Pages 設定: リポジトリ Settings → Pages → Source = main ブランチ / `/docs` フォルダ。

## 使い方（記録 ＝ 主にClaudeが実行）
```
# 一覧 / 進捗
python journal.py list
python journal.py list --game bandit

# レベルを作る/更新（無ければ自動作成）
python journal.py set-level --game bandit --level 14-15 \
  --title "ポート30000に喋る" --goal "..." --status done --date 2026-06-17 --tags nc,network

# 手順（コマンド＋解説）を1つ追加
python journal.py add-step --game bandit --level 14-15 \
  --cmd "nc localhost 30000" --note "ncで生のTCP接続。パスワードを送ると次が返る。"

# 学びを追加
python journal.py add-takeaway --game bandit --level 14-15 --text "ncは万能なネットワークの十徳ナイフ。"

# 新しいゲーム/サイトを足す（拡張）
python journal.py add-game --site overthewire --id natas --name Natas \
  --url https://overthewire.org/wargames/natas/ --desc "Webの基礎"
python journal.py add-site --id pwncollege --name "pwn.college"

# data.js を作り直す（通常は上記コマンドが自動でやる）
python journal.py render
```

## 運用
- データの正は `data/journal.json`。CLIが書き換えるたびに `site/data.js` を自動再生成。
- セッションでBanditを進めるたびに Claude が `set-level` / `add-step` / `add-takeaway` で追記し、`open` で開いて見せる。
- 区切りで GitHub(Private) へ手動push（second/third-project と同じ運用）。
