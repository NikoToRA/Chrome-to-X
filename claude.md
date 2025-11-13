# Chrome to X - Claude開発ガイドライン

## ハンドラーファイルの役割

### 1. `content/platforms/generic.js` - 汎用ハンドラー（デフォルト使用）
**指定がない限り、このファイルを調整・修正してください。**

- あらゆるWebサイトで動作する汎用的なテキスト貼り付けハンドラー
- Google Docsでの動作実績あり
- 特徴:
  - execCommand → ClipboardAPI → DOM操作の3段階フォールバック
  - Background Script経由のクリップボード操作（フォーカス不要）
  - 非標準要素（カスタム要素、Reactコンポーネント等）への対応
  - IFRAMEの検出と適切な処理

### 2. `content/platforms/default.js` - Google Docs用ハンドラー（保守用）
- 元々は汎用ハンドラーでしたが、Google Docsでの動作が確認されたため、そのまま保持
- Google Docs専用として使用（`window.PlatformHandlers.default`として登録）
- **このファイルは触らないでください（後方互換性のため保持）**

### 3. `content/platforms/x.js` - X (旧Twitter) 専用ハンドラー
- X固有のDOM構造（`[data-testid="tweetTextarea_0"]`等）に対応
- **Xの機能修正時のみ変更可**

### 4. `content/platforms/facebook.js` - Facebook 専用ハンドラー
- Facebook固有のDOM構造に対応
- **Facebookの機能修正時のみ変更可**

### 5. `content/platforms/google-docs.js` - Google Docs 専用ハンドラー（現在未使用）
- Google Docs専用の実装（CANVAS要素等）
- 現在は`default.js`が使われているため、このファイルは読み込まれていません

## ハンドラーの優先順位（`content/content.js`）

```javascript
// 1. プラットフォーム固有のハンドラー
if (platform === 'x' && window.PlatformHandlers.x) {
  handler = window.PlatformHandlers.x;
}
else if (platform === 'facebook' && window.PlatformHandlers.facebook) {
  handler = window.PlatformHandlers.facebook;
}
// 2. 汎用ハンドラー（フォールバック）
else if (window.PlatformHandlers.generic) {
  handler = window.PlatformHandlers.generic;
}
// 3. defaultハンドラー（後方互換性）
else if (window.PlatformHandlers.default) {
  handler = window.PlatformHandlers.default;
}
```

## 開発ルール

### 一般的な修正・改善
- **指定がない限り、`content/platforms/generic.js`を調整してください**
- このファイルは汎用性が高く、ほとんどのWebサイトで動作します

### プラットフォーム固有の修正
- X、Facebook、Google Docsなど、特定のプラットフォームでの問題がある場合のみ、該当する専用ハンドラーを修正してください
- 例: Xの投稿ボタンが見つからない → `content/platforms/x.js`を修正

### 新しいプラットフォームの追加
1. `content/platforms/`に新しいファイルを作成（例: `notion.js`）
2. `manifest.json`の`content_scripts`に追加
3. `content/content.js`のハンドラー選択ロジックに追加
4. プラットフォーム検出を`utils/detector.js`に追加

## ファイル構成

```
content/
├── platforms/
│   ├── generic.js       ← 汎用ハンドラー（デフォルト使用）
│   ├── default.js       ← Google Docs用（保守用、触らない）
│   ├── x.js            ← X専用
│   ├── facebook.js     ← Facebook専用
│   └── google-docs.js  ← Google Docs専用（未使用）
└── content.js          ← メインのコンテンツスクリプト
```

## 重要な注意事項

1. **X、Facebook、Gmailのコードには触れないでください**（明示的な指示がない限り）
2. **汎用的な改善は必ず`generic.js`で行ってください**
3. **`default.js`は後方互換性のため保持していますが、新しい開発では使用しません**
4. **プラットフォーム固有の問題がある場合のみ、該当する専用ハンドラーを修正してください**

## テスト方法

### 汎用ハンドラーのテスト
1. 様々なWebサイト（GitHub、Notion、LinkedIn等）でテスト
2. Google Docsでのテスト（既知の動作実績あり）
3. iframeを使ったサイト（Claude.ai等）でのテスト

### プラットフォーム固有のテスト
- X: ツイート投稿画面でテスト
- Facebook: 投稿作成画面でテスト
- Google Docs: ドキュメント編集画面でテスト

## よくある質問

### Q: 貼り付けが動かないサイトがある
A: まず`content/platforms/generic.js`を確認し、3段階フォールバックが正しく動作しているか確認してください。

### Q: X/Facebook/Gmailで問題が発生した
A: 該当する専用ハンドラー（`x.js`、`facebook.js`等）を確認してください。

### Q: 新しいプラットフォームに対応したい
A: まず`generic.js`で動作するか試してください。動作しない場合は、新しい専用ハンドラーを作成してください。

### Q: Google Docsで貼り付けが動かない
A: `default.js`がGoogle Docs用として動作しています。問題がある場合は、このファイルを確認してください。

---

最終更新日: 2025-01-14
