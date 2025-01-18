# Browser NLP Server for MCP

Browser Useを自然言語で操作するためのModel Context Protocol (MCP) サーバーです。

## 機能

- 自然言語でブラウザ操作を指示
- Browser Useの機能を活用した自動ブラウザ操作
- シンプルなインターフェース

## インストール

```bash
npm install @modelcontextprotocol/browser-nlp-server
```

## 使用方法

MCPの設定ファイルに以下を追加します：

```json
{
  "mcpServers": {
    "browser-nlp": {
      "command": "browser-nlp-server"
    }
  }
}
```

## ツール

### execute_browser_command

自然言語でブラウザ操作を実行します。

パラメータ:
- command: 実行したい操作の説明（必須）
- url: 操作対象のURL（オプション）

例：
```json
{
  "command": "Googleで'天気'を検索",
  "url": "https://www.google.com"
}
```

## ライセンス

MIT
