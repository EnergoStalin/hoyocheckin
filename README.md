# Features
- HI3 and HSR daily check in
- Telegram notfication

# Setup
- Open [hoyolab]() and get `ltoken_v2` and `ltuid_v2` cookies
- Create src/creds.js file like this:
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
# Bootstrap.mjs (optional)
- Run bootstap.js it will complete some manual steps automatically
# Manual
- Install clasp for convinience
    ```sh
    npm install -g @google/clasp
    ```
- Run:
    ```sh
    clasp login
    clasp create --rootDir src --title hoyocheckin --type standalone
    mv src/.clasp.json .
    clasp push -f
    ```
- Add `https://www.googleapis.com/auth/script.external_request` scope to `src/appsscript.json`
- All above is done by `bootstrap.mjs` next steps cant be automated
- Then run:
    ```sh
    clasp open
    ```
    To open created project. Next and last run `daily` function of `Code.gs` file once manually from ui to allow connections to external services then set up time based trigger for `daily` function in timers tab.
