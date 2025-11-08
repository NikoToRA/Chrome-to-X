/**
 * AIエージェントのデフォルトプリセットとユーティリティ
 */
(function () {
  const DEFAULT_AGENT_DEFINITIONS = [
    {
      id: 'buzz',
      label: 'Buzz Booster',
      name: 'バズ投稿エージェント',
      description: 'SNSで話題を生むテンション高めの投稿を生成します。',
      instructions:
        '最新のトレンドやエモーショナルなフレーズを織り交ぜ、ユーザーの共感を誘う構成でテキストを組み立ててください。140文字以内を推奨。'
    },
    {
      id: 'reply',
      label: 'Reply Concierge',
      name: '返信サポートエージェント',
      description: '丁寧かつ簡潔な返信メッセージを提案します。',
      instructions:
        '相手の意図を汲み取り、礼儀正しく、次のアクションが明確になる文章を提案してください。語尾は柔らかく。'
    },
    {
      id: 'editor',
      label: 'Rewrite Master',
      name: '文章リライトエージェント',
      description: '既存の文章を読みやすくリライトします。',
      instructions:
        '元のニュアンスを保ちながら、構成・語彙を整え、プロフェッショナルで信頼できる印象の文章に書き換えてください。'
    }
  ];

  function timestamp() {
    return new Date().toISOString();
  }

  /**
   * デフォルトエージェントを取得（都度新しいタイムスタンプ付きでコピーを返す）
   * @returns {Array}
   */
  function getDefaultAgents() {
    const now = timestamp();
    return DEFAULT_AGENT_DEFINITIONS.map((agent) => ({
      ...agent,
      createdAt: agent.createdAt || now,
      updatedAt: agent.updatedAt || now
    }));
  }

  /**
   * エージェントIDを生成
   * @param {string} [prefix]
   * @returns {string}
   */
  function generateAgentId(prefix = 'agent') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * 新しいエージェントの雛形を作成
   * @param {Object} partial
   * @returns {Object}
   */
  function createAgent(partial = {}) {
    const now = timestamp();
    return {
      id: partial.id || generateAgentId(),
      label: partial.label || 'Custom Agent',
      name: partial.name || '',
      description: partial.description || '',
      instructions: partial.instructions || '',
      createdAt: partial.createdAt || now,
      updatedAt: partial.updatedAt || now
    };
  }

  const AiAgentUtils = {
    getDefaultAgents,
    generateAgentId,
    createAgent
  };

  if (typeof window !== 'undefined') {
    window.AiAgentUtils = AiAgentUtils;
  }
})();

