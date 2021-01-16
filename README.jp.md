# PictureStoreKeeper

「PictureStoreKeeper」は、画像をフォルダ間で移動させるだけのシンプルな画像整理ツールです。

## 開発者向け文書

### ビルド方法

次がインストールされていることを確認して下さい。

- Go 言語環境 (`go build` コマンドが使えること)
- Node.js 環境 (`npm` コマンドが使えること)
- pnpm (`pnpm` コマンドが使えること、`npm i -g pnpm` でインストールできます)

#### 準備

```shell
$ pnpm i
$ go get github.com/labstack/echo/...
```

#### ビルド

```shell
$ pnpm build
```

スクリプトが終了すると、`apps/server/dist/linux_x64` に成果物が生成されます。

#### 起動

```shell
$ cd ./apps/server/dist/linux_x64
$ ./picture-store-keeper
# localhost:1323/ にアクセスして下さい
```
