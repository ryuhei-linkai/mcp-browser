#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class BrowserNLPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'browser-nlp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'execute_browser_command',
          description: '自然言語の指示をブラウザ操作に変換して実行します',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: '実行したい操作の説明（日本語）',
              },
              url: {
                type: 'string',
                description: '操作対象のURL（オプション）',
              }
            },
            required: ['command'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'execute_browser_command') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const { command, url } = request.params.arguments as {
        command: string;
        url?: string;
      };

      try {
        // ここでBrowser Useのツールを使用してブラウザ操作を実行
        // 注：実際のBrowser Use操作は、このMCPを使用するLLMが行います
        return {
          content: [
            {
              type: 'text',
              text: `ブラウザ操作コマンドを受け付けました：${command}${
                url ? `\nURL: ${url}` : ''
              }`,
            },
          ],
        };
      } catch (err) {
        const error = err as Error;
        return {
          content: [
            {
              type: 'text',
              text: `エラーが発生しました: ${error.message || '不明なエラー'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Browser NLP MCP server running on stdio');
  }
}

const server = new BrowserNLPServer();
server.run().catch(console.error);
