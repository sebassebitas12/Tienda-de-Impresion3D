// Server-only: credentials never enter the client bundle.
export async function runDeepSeek(messages, { env, fetchImpl, tools = [], executeTool }) {
  const key = env.DEEPSEEK_API_KEY?.trim();
  if (!key) return { error: 'ASSISTANT_NOT_CONFIGURED' };
  const conversation = [...messages];
  let adminAction;
  for (let iteration = 0; iteration < 6; iteration += 1) {
    const response = await fetchImpl('https://api.deepseek.com/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: env.DEEPSEEK_MODEL || 'deepseek-flash', messages: conversation,
        max_tokens: 2400, response_format: { type: 'json_object' },
        ...(tools.length ? { tools, tool_choice: 'auto' } : {}) }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return { error: response.status === 401 ? 'ASSISTANT_CREDENTIAL_INVALID' : response.status === 402 ? 'ASSISTANT_CREDIT_REQUIRED' : 'ASSISTANT_UNAVAILABLE' };
    const choice = (await response.json())?.choices?.[0];
    const turn = choice?.message;
    if (!turn || choice.finish_reason === 'length') return { error: 'ASSISTANT_INVALID_RESPONSE' };
    if (turn.tool_calls?.length) {
      if (turn.tool_calls.length > 4) return { error: 'ASSISTANT_ITERATION_LIMIT' };
      conversation.push(turn);
      for (const call of turn.tool_calls) {
        let args;
        try { args = JSON.parse(call.function.arguments); } catch { args = null; }
        const result = await executeTool(call.function.name, args);
        if (call.function.name === 'prepare_catalog_action' && !result.error) adminAction = result;
        conversation.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
      }
      continue;
    }
    try { return { output: JSON.parse(turn.content), adminAction }; }
    catch { return { error: 'ASSISTANT_INVALID_RESPONSE' }; }
  }
  return { error: 'ASSISTANT_ITERATION_LIMIT' };
}
