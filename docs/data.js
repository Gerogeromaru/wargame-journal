// 自動生成ファイル。手で編集しない（data/journal.json が正）。
window.JOURNAL_DATA = {
  "meta": {
    "title": "Wargame Journal",
    "subtitle": "練習サイトの攻略記録（コマンド＋解説）",
    "updated": "2026-06-16"
  },
  "sites": [
    {
      "id": "overthewire",
      "name": "OverTheWire",
      "url": "https://overthewire.org/wargames/",
      "games": [
        {
          "id": "bandit",
          "name": "Bandit",
          "url": "https://overthewire.org/wargames/bandit/",
          "description": "Linux/CLIの基礎を学ぶ定番ウォーゲーム。SSHで各レベルにログインし、次のレベルのパスワードを探す。",
          "connect": "ssh banditN@bandit.labs.overthewire.org -p 2220",
          "levels": [
            {
              "id": "0-1",
              "from": 0,
              "to": 1,
              "title": "SSHでログインしてreadmeを読む",
              "goal": "ホームディレクトリにある readme に次のパスワードが書いてある。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "ssh",
                "cat",
                "ls"
              ],
              "steps": [
                {
                  "cmd": "ssh bandit0@bandit.labs.overthewire.org -p 2220",
                  "note": "ポート2220でSSH接続。初期パスワードは bandit0。"
                },
                {
                  "cmd": "ls",
                  "note": "今いるフォルダのファイル一覧。readme が見える。"
                },
                {
                  "cmd": "cat readme",
                  "note": "ファイルの中身を表示。catはconcatenate（連結・表示）の略。"
                }
              ],
              "takeaways": [
                "ssh / ls / cat というLinux操作の3点セット。",
                "Banditはポート22ではなく2220。"
              ]
            },
            {
              "id": "1-2",
              "from": 1,
              "to": 2,
              "title": "ファイル名が「-」のファイルを読む",
              "goal": "パスワードはファイル名が「-」のファイルに入っている。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "cat",
                "trap"
              ],
              "steps": [
                {
                  "cmd": "cat ./-",
                  "note": "「cat -」は標準入力待ちになってしまう。-で始まる名前はオプションと誤解されるので、./ を付けて「カレントの-」と明示する。"
                }
              ],
              "takeaways": [
                "先頭が - の名前は ./ を付けて扱う（オプション誤認の回避）。"
              ]
            },
            {
              "id": "2-3",
              "from": 2,
              "to": 3,
              "title": "名前に空白を含むファイルを読む",
              "goal": "パスワードは空白を含む名前のファイルに入っている。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "cat",
                "escape"
              ],
              "steps": [
                {
                  "cmd": "cat \"spaces in this filename\"",
                  "note": "空白はシェルでは区切り文字。ダブルクォートで囲むか、各空白を \\ でエスケープする（cat spaces\\ in\\ this\\ filename）。"
                }
              ],
              "takeaways": [
                "空白入りファイル名はクォートかバックスラッシュでエスケープ。",
                "Tabキー補完を使うと自動でエスケープしてくれて速い。"
              ]
            },
            {
              "id": "3-4",
              "from": 3,
              "to": 4,
              "title": "隠しファイルを読む",
              "goal": "パスワードは inhere フォルダ内の隠しファイルにある。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "ls",
                "hidden"
              ],
              "steps": [
                {
                  "cmd": "ls -la inhere",
                  "note": "-a は隠しファイル（.で始まる名前）も表示。-l は詳細表示。隠しファイル名が見える。"
                },
                {
                  "cmd": "cat inhere/...Hiding-From-You",
                  "note": "見つけた隠しファイルを読む（名前は実際に見えたものに置き換え）。"
                }
              ],
              "takeaways": [
                ". で始まるファイルは通常のlsでは見えない＝ls -a で出す。"
              ]
            },
            {
              "id": "4-5",
              "from": 4,
              "to": 5,
              "title": "人間が読めるファイルだけを選ぶ",
              "goal": "inhere の -fileNN のうち、人間が読めるテキスト1つにパスワードがある。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "file",
                "find"
              ],
              "steps": [
                {
                  "cmd": "file ./inhere/-file*",
                  "note": "file はファイルの中身の種類を判定する。ASCII text と出たものが人間可読。"
                },
                {
                  "cmd": "cat ./inhere/-file07",
                  "note": "ASCII text だったファイルを読む（番号は実際の結果に置き換え）。"
                }
              ],
              "takeaways": [
                "file コマンドで「これは何のファイルか」を調べる。拡張子に頼らず中身で判定する。"
              ]
            },
            {
              "id": "5-6",
              "from": 5,
              "to": 6,
              "title": "条件に合うファイルをfindで探す（サイズ・実行不可）",
              "goal": "人間が読める / サイズ1033バイト / 実行不可、のファイルを探す。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "find",
                "size"
              ],
              "steps": [
                {
                  "cmd": "find inhere -size 1033c ! -executable",
                  "note": "-size 1033c はちょうど1033バイト（cはバイト単位）。! -executable は「実行可能でない」。条件を重ねて絞り込む。"
                },
                {
                  "cmd": "cat <見つかったパス>",
                  "note": "ヒットしたファイルを読む。"
                }
              ],
              "takeaways": [
                "find は条件（サイズ/権限/名前など）を重ねて探せる。",
                "! は条件の否定。"
              ]
            },
            {
              "id": "6-7",
              "from": 6,
              "to": 7,
              "title": "サーバー全体からfindで探す（所有者・グループ）",
              "goal": "サーバーのどこか / user=bandit7 / group=bandit6 / サイズ33バイト、のファイル。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "find",
                "permissions",
                "stderr"
              ],
              "steps": [
                {
                  "cmd": "find / -user bandit7 -group bandit6 -size 33c 2>/dev/null",
                  "note": "/ から全体探索。-user/-group で所有者を指定。2>/dev/null は「権限がない場所のエラーメッセージ（標準エラー）をゴミ箱に捨てる」＝結果が見やすくなる。"
                },
                {
                  "cmd": "cat <見つかったパス>",
                  "note": "ヒットしたファイルを読む。"
                }
              ],
              "takeaways": [
                "2>/dev/null でPermission deniedの洪水を消す。",
                "find は所有者・グループでも絞れる。"
              ]
            },
            {
              "id": "7-8",
              "from": 7,
              "to": 8,
              "title": "grepで単語の隣を抜き出す",
              "goal": "data.txt の中で単語 millionth の隣にパスワードがある。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "grep"
              ],
              "steps": [
                {
                  "cmd": "grep millionth data.txt",
                  "note": "grep は指定した文字列を含む行を抜き出す。その行の隣の列がパスワード。"
                }
              ],
              "takeaways": [
                "grep は『この語を含む行』を一発で絞り込む基本道具。"
              ]
            },
            {
              "id": "8-9",
              "from": 8,
              "to": 9,
              "title": "1度だけ出現する行を見つける",
              "goal": "data.txt の中で、ただ1回だけ出現する行がパスワード。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "sort",
                "uniq"
              ],
              "steps": [
                {
                  "cmd": "sort data.txt | uniq -u",
                  "note": "uniq は『隣り合う重複』しか消せないので、先に sort で同じ行を隣同士に並べる。-u は『1回だけの行』だけを出す。"
                }
              ],
              "takeaways": [
                "uniq の前には基本 sort が要る（隣接重複前提）。",
                "| (パイプ) で左の出力を右へ流す。"
              ]
            },
            {
              "id": "9-10",
              "from": 9,
              "to": 10,
              "title": "バイナリから可読文字列を抜く（strings）",
              "goal": "data.txt の中で、数個の = に続く人間可読な文字列がパスワード。",
              "status": "done",
              "date": "2026-06-15",
              "boss": false,
              "tags": [
                "strings",
                "grep"
              ],
              "steps": [
                {
                  "cmd": "strings data.txt | grep =",
                  "note": "strings はバイナリ混じりのファイルから『人間が読める文字列』だけを抜き出す。それを grep = で = を含む行に絞る。"
                }
              ],
              "takeaways": [
                "strings はバイナリ調査の定番（埋め込み文字列・パスワード・URLの発見）。"
              ]
            },
            {
              "id": "10-11",
              "from": 10,
              "to": 11,
              "title": "base64をデコードする",
              "goal": "data.txt は base64 でエンコードされている。",
              "status": "done",
              "date": "2026-06-16",
              "boss": false,
              "tags": [
                "base64",
                "encoding"
              ],
              "steps": [
                {
                  "cmd": "base64 -d data.txt",
                  "note": "-d は decode。base64 は暗号ではなく『バイナリをテキストで表す変換』。末尾の = はパディングの目印。鍵なしで誰でも復号できる。"
                }
              ],
              "takeaways": [
                "= で終わる文字列を見たら base64 を疑う。",
                "エンコード ≠ 暗号。base64は秘匿用途には使えない。"
              ]
            },
            {
              "id": "11-12",
              "from": 11,
              "to": 12,
              "title": "ROT13を解く（trで換字）",
              "goal": "data.txt は全アルファベットが13文字ずらされている（ROT13）。",
              "status": "done",
              "date": "2026-06-16",
              "boss": false,
              "tags": [
                "rot13",
                "tr",
                "encoding"
              ],
              "steps": [
                {
                  "cmd": "cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
                  "note": "tr は文字を一対一で置換する道具。左の集合(A-Z,a-z)を、右の集合(13ずらした並び)に対応させる。13は26の半分なので、同じ操作で暗号化も復号もできる。"
                }
              ],
              "takeaways": [
                "tr '元の集合' '先の集合' は位置で一対一対応。",
                "大文字と小文字は別物なので両方書く。"
              ]
            },
            {
              "id": "12-13",
              "from": 12,
              "to": 13,
              "title": "★ボス：hexdump＋多重圧縮を全部はがす",
              "goal": "data.txt は『16進ダンプされた圧縮ファイル』で、しかも何重にも圧縮されている。元に戻して解凍を繰り返す。",
              "status": "done",
              "date": "2026-06-16",
              "boss": true,
              "tags": [
                "xxd",
                "file",
                "gzip",
                "bzip2",
                "tar",
                "compression"
              ],
              "steps": [
                {
                  "cmd": "mkdir /tmp/akb && cp data.txt /tmp/akb/ && cd /tmp/akb",
                  "note": "ホームは書き込み禁止なので、書ける /tmp に自分専用の作業フォルダを作ってコピーしてから作業する。"
                },
                {
                  "cmd": "xxd -r data.txt > data.bin",
                  "note": "data.txt は16進ダンプ（バイナリをテキスト化したもの）。xxd -r でreverse＝元のバイナリに戻す。> でファイルに保存。"
                },
                {
                  "cmd": "file data.bin",
                  "note": "正体を調べる → gzip compressed。"
                },
                {
                  "cmd": "mv data.bin data.gz && gunzip data.gz",
                  "note": "gunzip は .gz で終わる名前でないと解凍しない。改名してから解凍。"
                },
                {
                  "cmd": "file data",
                  "note": "→ bzip2 compressed。"
                },
                {
                  "cmd": "mv data data.bz2 && bunzip2 data.bz2",
                  "note": "bzip2 は .bz2 が必要。改名→解凍。"
                },
                {
                  "cmd": "file data",
                  "note": "→ POSIX tar archive。"
                },
                {
                  "cmd": "tar xf data",
                  "note": "tar は『複数を束ねた箱』。x=取り出す, f=このファイル。中身（data5.binなど）が出てくる。"
                },
                {
                  "cmd": "file data5.bin && tar xf data5.bin",
                  "note": "また tar だったのでもう一度展開。形式が変わるたびに file → 解凍を繰り返す。"
                },
                {
                  "cmd": "ls -lt",
                  "note": "迷子防止：今あるファイルを確認。※tarで出たファイルは作成時刻を引き継ぐので-ltの並びは当てにならない→中身は file で見分ける。"
                },
                {
                  "cmd": "cat data",
                  "note": "最後に ASCII text まで剥がれたら中身を読む＝パスワード。"
                }
              ],
              "takeaways": [
                "得体の知れないファイルは file で正体を調べ、形式に合った道具で解凍する、を繰り返す。",
                "圧縮と道具の対応：gzip→gunzip(.gz) / bzip2→bunzip2(.bz2) / tar→tar xf。",
                "権限のない場所で詰まったら /tmp など書ける場所に作業ディレクトリを作る。",
                "ファイルが増えて迷子になったら ls / file で現在地を立て直す。"
              ]
            },
            {
              "id": "13-14",
              "from": 13,
              "to": 14,
              "title": "SSH秘密鍵でログインする（鍵を持ち帰る）",
              "goal": "次のパスワードは取れない。代わりに bandit14 用のSSH秘密鍵 sshkey.private が置いてある。それでログインする。",
              "status": "done",
              "date": "2026-06-16",
              "boss": false,
              "tags": [
                "ssh",
                "private-key",
                "lateral-movement",
                "permissions"
              ],
              "steps": [
                {
                  "cmd": "cat sshkey.private",
                  "note": "RSA秘密鍵の中身を確認（-----BEGIN RSA PRIVATE KEY-----）。"
                },
                {
                  "cmd": "ssh -i sshkey.private bandit14@localhost -p 2220",
                  "note": "【失敗】OverTheWireは『サーバー内からlocalhost:2220接続』を遮断するようになった。サーバー内ではホスト名も127.0.0.1に解決される。"
                },
                {
                  "cmd": "（自分のPCに鍵を保存）icacls key /inheritance:r /grant:r \"ユーザー:(R)\"",
                  "note": "正攻法＝鍵を自分の攻撃マシンに持ち帰って外からログイン。Windowsは鍵の権限に厳格なので、継承を切って自分だけ読める状態にする（Linuxなら chmod 600）。"
                },
                {
                  "cmd": "ssh -i key bandit14@bandit.labs.overthewire.org -p 2220",
                  "note": "自分のPC（外）からなら本物の公開IPに解決され、localhostブロックに当たらずログインできる。パスワードを聞かれず入れれば成功＝鍵認証。"
                },
                {
                  "cmd": "cat /etc/bandit_pass/bandit14",
                  "note": "Banditでは各ユーザーのパスワードがここに置かれる。bandit14本人だけが読める。"
                }
              ],
              "takeaways": [
                "盗んだ秘密鍵は自分のマシンに持ち帰って使う＝実戦のlateral movement（横展開）。",
                "ssh -i で鍵を指定。鍵ファイルは chmod 600 / icacls で『自分だけ』に締める。",
                "鍵認証ならパスワードなしでログインできる（昨日のMac⇔Win SSHと同じ原理）。"
              ]
            }
          ]
        }
      ]
    }
  ]
};
