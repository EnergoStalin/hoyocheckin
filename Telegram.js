function _(str) {
  return str
    .replaceAll(/\s*\n\s*/g, "\n")
    .replaceAll(/([\.!])/g, "\\$1")
}

async function sendTelegram(message) {
  console.log(message)
  UrlFetchApp.fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN()}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    payload: JSON.stringify({
      chat_id: TELEGRAM_BOT_CHAT_ID(),
      text: message,
      parse_mode: "MarkdownV2"
    })
  })
}

