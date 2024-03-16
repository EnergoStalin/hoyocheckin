const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36",
  Cookie: COOKIES()
}

class Signer {
  constructor(baseUrl, actId, cookies) {
    this.cookies = cookies
    this.baseUrl = baseUrl
    this.actId = actId
  }

  fetch(url, options) {
    return UrlFetchApp.fetch(url, {
      headers: this.cookies,
      muteHttpExceptions: true,
      method: "GET",
      ...options
    })
  }

  verifyResponse(res) {
    if (res.getResponseCode() !== 200) {
      throw new Error(`HTTP error: ${res.getResponseCode()}`)
    }

    const body = JSON.parse(res.getContentText())
    if (body.retcode !== 0 && body.message !== "OK") {
      throw new Error(`API error: ${body.message}`)
    }

    return body
  }

  getJsonDecodedBodyData(res) {
    return this.verifyResponse(res).data
  }

  sign() {
    return this.verifyResponse(
      this.fetch(`${this.baseUrl}/sign`, {
        method: "POST",
        payload: JSON.stringify({
          act_id: this.actId,
        })
      })
    )
  }

  getInfo() {
    return this.getJsonDecodedBodyData(
      this.fetch(`${this.baseUrl}/info?act_id=${this.actId}`)
    )
  }

  getAwards() {
    return this.getJsonDecodedBodyData(
      this.fetch(`${this.baseUrl}/home?act_id=${this.actId}`)
    ).awards
  }
}

async function sign(url, actId, cookies) {
  const api = new Signer(url, actId, cookies)

  const info = api.getInfo()
  const awards = api.getAwards()

  if (awards.length === 0) {
    throw new Error("There's no awards to claim (?)")
  }

  const data = {
    today: info.today,
    totalSigned: info.total_sign_day,
    isSigned: info.is_sign,
    missed: info.sign_cnt_missed
  }

  if (data.isSigned) {
    return "Already checked in today."
  }

  const awardData = {
    name: awards[data.totalSigned].name,
    count: awards[data.totalSigned].cnt
  };

  api.sign()

  return `
    Signed in successfully! You have signed in for ${data.totalSigned} days!
    You have received ${awardData.count}x ${awardData.name}!
  `
}

async function daily() {
  try {
    const [HSR, HI3] = await Promise.all([
      sign("https://sg-public-api.hoyolab.com/event/luna/os", "e202303301540311", HEADERS),
      sign("https://sg-public-api.hoyolab.com/event/mani", "e202110291205111", HEADERS)
    ])

    await sendTelegram(`
      [HSR](https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html):
      ${HSR}
      [HI3](https://act.hoyolab.com/bbs/event/signin-bh3/index.html):
      ${HI3}
    `)
  } catch (ex) {
    await sendTelegram(`Exception caught: ${ex}`)
  }
}
