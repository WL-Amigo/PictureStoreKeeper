 PictureStoreKeeper
==========

「PictureStoreKeeper」は、画像をフォルダ間で移動させるだけのシンプルな画像整理ツールです。

## 開発者向け文書

### ビルド方法

次がインストールされていることを確認して下さい。

* Go言語環境 (`go build` コマンドが使えること)
* Node.js環境 (`npm` コマンドが使えること)
* yarn (一応無くてもビルドは出来ます)

#### フロントエンドのビルドの準備

```shell
$ cd Frontend/
$ npm install
# もしくは
$ yarn install
```

#### バックエンドのビルドの準備

```shell
$ go get github.com/labstack/echo/...
```

#### ビルド

yarnが入っていない場合は、`build.sh` 中の次の行を変更して下さい。

* `yarn build` -> `npm run build`

```shell
$ ./build.sh
```

スクリプトが終了すると、`build-release` というディレクトリが出来ます。

#### 起動

```shell
$ cd build-release/
$ ./picture-store-keeper-backend
# localhost:1323/ にアクセスして下さい
```

## TODO

- [ ] 未整理・整理ディレクトリの概念を統合する
  - データ構造とAPIエンドポイント構造の変更(バック)
  - 最初に転送元ディレクトリを選ぶようにし、それ以外のディレクトリを転送先にする(フロント)
- [ ] ギャラリー機能
- [ ] 複数人での画像整理のサポート
  - ファイルリストのストリーミング的な配信を行えるようにする(バック)
  - ストリーミング的にファイルリストを受信するように変更する(フロント)
- [ ] Dockerize