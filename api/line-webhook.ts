import { defineEventHandler, readBody } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  // POST以外は405を返す
  if (event.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const body = await readBody(event)

  // LINEの検証リクエストなど、eventsがない場合も200を返す
  const replyToken = body.events?.[0]?.replyToken
  const userMessage = body.events?.[0]?.message?.text

  if (!replyToken || !userMessage) return { status: "ok" }

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
  