# 不要な電話番号の一括削除

このプログラムを使うことで、CSVで提供される不要な電話番号を一括で削除することができます。  

## 前提（動作確認済み）条件

- Node.js バージョン 16.13以上
- npm 8.1.0以上
- yarn 1.x（オプション）

## セットアップ

```zsh
git clone https://github.com/mobilebiz/release-numbers-from-csv.git
cd release-numbers-from-csv
yarn install # or npm install
```

## CSVファイルの準備

CSVの形式は、電話番号のみでタイトル行も不要です。電話番号形式はE.164形式でも0ABJ形式でも大丈夫です。  
relase-numbers-from-csvフォルダの直下に、numbers.csvという名前で作成します。すでにサンプルのCSVが入っています。

```csv
050-1234-5678
+815012345678
・・・
```

## 環境変数の設定

```zsh
cp .env.example .env
```

`.env`を以下の内容で更新してください。

Key|Value
:--|:--
TWILIO_ACCOUNT_SID|対象とするアカウントのAccountSid
TWILIO_AUTH_TOKEN|同じくAuthToken

## 実行

```zsh
node index.js [delete]
```

`delete`パラメータを付与した場合は、実際に削除が行われます。付与していない場合は、削除はしないで対象となる番号が表示されます。

## 実行例

```sh
% node index.js delete
+815012345678
not found: +815012345678
+815031965830
+815031965832
+815031965837
delete: +815031965830
delete: +815031965832
+815031965841
+815031965842
delete: +815031965837
```

## 制限事項

削除は非同期で行われるため、上記のようにdelete行が遅れて表示される場合があります。
