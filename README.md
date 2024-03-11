# Features
- HI3 and HSR daily check in
- Telegram notfication

# Setup
- Open [hoyolab]() and get `ltoken_v2` and `ltuid_v2` cookies
- Create creds.js file like this:
    ```js
    function TELEGRAM_BOT_TOKEN() {
      return ""
    }

    function TELEGRAM_BOT_CHAT_ID() {
      return "" // Your telegram user id
    }

    function COOKIES() {
      return ""
    }
    ```
- Run:
    ```sh
    pnpm i
    pnpm exec clasp login
    pnpm exec clasp create
    pnpm exec clasp push
    ```
- Then run:
    ```sh
    pnpm exec clasp open
    ```
    To open created project. Next and last set up time based trigger for `Code.gs` in timers tab.
