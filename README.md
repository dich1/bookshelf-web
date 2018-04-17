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

## 開発フロー
### github-flow  
現行版置き替えまで  
[GitFlow vs GithubFlow](https://qiita.com/tlta-bkhn/items/fc485a66dbe48ec3b919)  

## 環境構築
1.Dockerインストール  
https://docs.docker.com/docker-for-mac/  
2.bookshelf-webフォーク  
3.フォークしたbookshelf-webクローン  
4.Docker起動  
```
docker-compose run web rails new . --force --database=postgresql  
docker-compose up -d  
docker-compose run web rake db:create  
```

## チケット  
### Issues

## 参考URL
### マークダウンの書き方
[README.mdファイル。マークダウン記法まとめ](http://codechord.com/2012/01/readme-markdown/)  
[わかりやすいREADME.mdを書く](https://deeeet.com/writing/2014/07/31/readme/)  
[Markdownで行こう！](https://gist.github.com/wate/7072365)  
[[無料]Githubで外部リンクを別タブで開くChrome拡張](https://qiita.com/KumanoT/items/c91390898573978fc979)  
### TODO管理
[チーム開発を変える「GitHub」とは？〜Issuesの使い方〜【連載第3回】](https://seleck.cc/647)  