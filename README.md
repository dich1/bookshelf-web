ほんだな
=============

## コンセプト
組織の書籍価値を高めよう

## 概要
本の貸出、本ベースの情報共有サービス

## システム要件
### 仕様
- 本を登録
- 登録されてる本の情報表示
   - 申請中…まだない
   - 貸出中…誰かが借りてる
   - 保管中…今ある

- 本棚にほしい機能
   - 検索機能
   - ユーザ登録
       - 誰が借りてるのか
       - 誰がほしがってる本なのか
       - 誰が読んだことあるのか
       - その本に対する評価コメント
   - レンタル期間表示早見カレンダーページ
   - 借入予約機能
   - 本のジャンル分け機能
   - 総本数、貸出中本数、申請中本数表示
   - slack連携
       - 期限告知
       - 延滞告知
       - 借りてる人へのメッセージリンク

## アーキテクチャ
![bookshelf構成図](https://github.com/dich1/bookshelf-web/blob/master/bookshelf-architecture.png?raw=true)
- rails
- postgres
- nginx
- puma
- capistrano
- circleci
- docker
- ec2

## アーキテクチャのスタイルの方針
- REST API
- ひとまずビュー使う際は極力htmlベース(テンプレート機能を使わない)
   - フロントとして切り離し易いため(Vueに移行予定)

## ER図
![ER図](https://github.com/dich1/bookshelf-web/blob/master/bookshelf-erd.png?raw=true)

## 開発フロー
### github-flow  
- 開発ブランチ1つで行う(現行版の置き替えまで)
- コミットには下記のprefixを使う
   - [feat]機能の追加
   - [fix]バグの修正
   - [refactor]書き替え
   - [docs]ドキュメントのみ変更
   - [style]コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
   - [test]テストコード
   - [chore]ビルドプロセスやドキュメント作成などの補助ツールやライブラリの変更

[GitFlow vs GithubFlow](https://qiita.com/tlta-bkhn/items/fc485a66dbe48ec3b919)  
[【今日からできる】コミットメッセージに 「プレフィックス」 をつけるだけで、開発効率が上がった話](https://qiita.com/numanomanu/items/45dd285b286a1f7280ed)  

## ドキュメント作成
### Gemを最大限活用する
- ER図生成
   - rails-erd
      - rake db:migrate時に生成するよう設定
         - bookshelf-erd.png

- DB定義書
   - schemadoc(できたら)

- API仕様書生成
   - swagger-docs(あとで)

- クラス図生成
   - yard graph
      - rake db:migrate時に生成するよう設定
         - bookshelf-classd.png

- コメント
   - yard
      - yardoc
      - yard server
         - http://localhost:8808

## テスト
- RSpec
   - Test::Unitより使い易いらしい

## JSONレスポンス設定
- active_model_serializers
   - jbuilderより処理速度が速く、テストが書き易いらしい

## 環境構築
### Docker使う場合
1.Dockerインストール  
https://docs.docker.com/docker-for-mac/  
2.bookshelf-webフォーク  
3.フォークしたbookshelf-webクローン  
4.Docker起動  
```
プロジェクトのルートディレクトリに移動 
docker-compose up -d  
docker-compose run --rm web rake db:create db:migrate 
```

## チケット  
### GitHubのIssuesを使う

## 参考URL
### マークダウンの書き方
[README.mdファイル。マークダウン記法まとめ](http://codechord.com/2012/01/readme-markdown/)  
[わかりやすいREADME.mdを書く](https://deeeet.com/writing/2014/07/31/readme/)  
[Markdownで行こう！](https://gist.github.com/wate/7072365)  
[[無料]Githubで外部リンクを別タブで開くChrome拡張](https://qiita.com/KumanoT/items/c91390898573978fc979)  
### TODO管理
[チーム開発を変える「GitHub」とは？〜Issuesの使い方〜【連載第3回】](https://seleck.cc/647)  