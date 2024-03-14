import fs from "node:fs"
import ps from "node:child_process"

function exec(command) {
  ps.execSync(command, {stdio: "inherit"})
}

exec("pnpm i -g @google/clasp", {stdio: "inherit"})
exec("clasp login", {stdio: "inherit"})
exec("clasp create --rootDir src --title hoyocheckin --type standalone", {stdio: "inherit"})

fs.renameSync("src/.clasp.json", ".clasp.json")

const data = JSON.parse(fs.readFileSync("src/appsscript.json", "utf-8").toString("utf-8"))

data.oauthScopes = ["https://www.googleapis.com/auth/script.external_request"]

fs.writeFileSync("src/appsscript.json", JSON.stringify(data, null, 2))

exec("clasp push -f", {stdio: "inherit"})
exec("clasp open", {stdio: "inherit"})
