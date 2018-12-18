ほんだな
=============

## コンセプト
組織の書籍価値を高めよう

## 概要
本の貸出管理・本派生の情報共有サービス

## システム要件
### 仕様
- 書籍登録(Google Books API)
   - ISBNバーコード読取登録
   - タイトル検索
- 参照
   - 貸出中一覧
   - 保管中一覧
   - タイトル検索一覧
   - ページ毎一覧
   - ジャンル毎一覧
- ユーザ登録(Facebook)    
- 借入
- 返却
- wiki機能(まだ)
- slack連携
   - 利用ユーザー通知
   - 期限告知(まだ)
   - 延滞告知(まだ)
   - 借りてる人へのメッセージリンク(まだ)
- Qiita連携
- マルチテナント対応(まだ)

## アーキテクチャ
![bookshelf構成図](https://github.com/dich1/bookshelf-web/blob/master/bookshelf-architecture.png?raw=true)  

- rails  
- mysql  
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

## テーブル定義書
![テーブル定義書](https://github.com/dich1/bookshelf-web/blob/master/schema.png?raw=true)

## クラス図
![クラス図](https://github.com/dich1/bookshelf-web/blob/master/bookshelf-classd.png?raw=true)

## 開発フロー
### github-flow(暫定)  
- origin masterからチケット番号のブランチ名を切って作業
   - 事前にフェッチ or プルで最新の状態を確認
- ローカルでの確認ができたらupstreamのmasterにプルリク  
   - 事前にフェッチ or プルで最新の状態を確認
   - 変更があったらmasterを自分の作業ブランチにマージしておく
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
Gemを最大限活用する

### ER図生成
- rails-erd
   - rake db:migrate時に自動生成
   - bookshelf-erd.png

### テーブル定義書
- schemadoc
   - rake db:migrate時に自動生成
   - schema.pdf

### クラス図生成
- yard graph
   - rake db:migrate時に自動生成
   - bookshelf-classd.png

### API仕様書生成
- openapi2ruby(あとで)

### コメント
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
ボリュームの作成
docker volume create --name=db-data
docker volume create --name=tmp-data
docker volume create --name=public-data
プロジェクトのルートディレクトリに移動  
docker-compose up -d  
docker-compose run --rm web rake db:create db:migrate 
https://localhost
```

## チケット  
- テンプレート  
[ISSUE_TEMPLATE.md](https://github.com/dich1/bookshelf-web/blob/master/ISSUE_TEMPLATE.md)

## プルリク  
- テンプレート
[PULL_REQUEST_TEMPLATE.md](https://github.com/dich1/bookshelf-web/blob/master/PULL_REQUEST_TEMPLATE.md)  

## 参考URL
### マークダウンの書き方
[README.mdファイル。マークダウン記法まとめ](http://codechord.com/2012/01/readme-markdown/)  
[わかりやすいREADME.mdを書く](https://deeeet.com/writing/2014/07/31/readme/)  
[Markdownで行こう！](https://gist.github.com/wate/7072365)   
