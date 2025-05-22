export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    const replyToken = body.events?.[0]?.replyToken
    const userMessage = body.events?.[0]?.message?.text
  
    if (!replyToken || !userMessage) return { status: "ignored" }
  
    const replyMessage = {
      type: "text",
      text: `You said: "${userMessage}". This is a test response from your LINE bot!`
    }
  
    const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
    await $fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: {
        replyToken,
        messages: [replyMessage]
      }
    })
  
    return { status: "ok" }
  })
  