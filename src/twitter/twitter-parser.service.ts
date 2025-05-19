import { Injectable } from '@nestjs/common';

export interface ParsedMemeToken {
  name?: string;
  symbol?: string;
  chain?: string;
  launched?: boolean;
  chartUrl?: string;
  contract?: string;
}

@Injectable()
export class TweetParserService {
  parseTweet(tweet: string): ParsedMemeToken {
    const result: ParsedMemeToken = {};

    // 1. Token symbol (e.g., $SHART)
    const symbolMatch = tweet.match(/\$[A-Z0-9]+/i);
    if (symbolMatch) {
      result.symbol = symbolMatch[0];
      result.name = symbolMatch[0].replace('$', '');
    }

    // 2. Chain name
    const chainMatch = tweet.match(/\b(Solana|Ethereum|ETH|SOL|Base|Arbitrum|Polygon)\b/i);
    if (chainMatch) {
      const chain = chainMatch[0].toLowerCase();
      result.chain = chain.charAt(0).toUpperCase() + chain.slice(1);
    }

    // 3. Launch keyword
    result.launched = /launch(ed|ing)?|new/i.test(tweet);

    // 4. Chart or DEX URL
    const urlMatch = tweet.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      result.chartUrl = urlMatch[0];
    }

    // 5. Contract address (if available)
    const contractMatch = tweet.match(/0x[a-fA-F0-9]{40}/);
    if (contractMatch) {
      result.contract = contractMatch[0];
    }

    return result;
  }

  formatOutput(token: ParsedMemeToken): string {
    return [
      `📌 Name: ${token.name ?? 'N/A'}`,
      `💰 Symbol: ${token.symbol ?? 'N/A'}`,
      `🔗 Chain: ${token.chain ?? 'Unknown'}`,
      `🚀 Launched: ${token.launched ? 'Yes' : 'No'}`,
      `📈 Chart: ${token.chartUrl ?? 'N/A'}`
    ].join('\n');
  }
}
