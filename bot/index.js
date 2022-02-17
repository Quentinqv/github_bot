class GithubBot {
  constructor() {
    this.config = require("./config/config.json")
    this.creds = require("../creds")
  }

  /**
   * Initialise Chromium et ouvre Instagram
   */
  async init() {
    const puppeteer = require("puppeteer")
    this.browser = await puppeteer.launch(this.config.settings)

    // Ouverture d'un onglet
    this.page = await this.browser.newPage()

    // Navigation vers l'URL défini
    await this.page.goto(this.config.base_url)

    // On attend que le body soit chargé
    await this.page.waitForSelector("body")
  }

  /**
   * Go to login page from "Sign in" button in header
   * Fill login and password fields then submit form
   */
  async login() {
    await this.page.waitForSelector(this.config.selectors.signin_button)
    let signin_button = await this.page.$(this.config.selectors.signin_button)
    await signin_button.evaluate((e) => e.click())

    // Wait for login input and write it the username
    await this.page.waitForSelector(this.config.selectors.login_field)
    await this.page.focus(this.config.selectors.login_field)
    await this.page.keyboard.type(this.creds.username)

    // Wait for password input and write it the password
    await this.page.waitForSelector(this.config.selectors.password_field)
    await this.page.focus(this.config.selectors.password_field)
    await this.page.keyboard.type(this.creds.password)

    // Submit login form
    await this.page.waitForSelector(this.config.selectors.login_submit)
    await this.page.click(this.config.selectors.login_submit)
  }

  /**
   * Go to search page with config.name on page 1 to (config.nbOfPage + 1)
   */
  async searchFor() {
    for (let i = 1; i < this.config.nbOfPage + 1; i++) {
      await this.page.goto(
        `https://github.com/search?q=${this.config.name}&type=users&p=${i}`
      )

      const users = await this.page.$$(this.config.selectors.allusers)
      console.log("nb of users", users.length)
      for (const key in users) {
        if (Object.hasOwnProperty.call(users, key)) {
          const user = users[key]

          const username = await user.evaluate((e) => {
            let href = e.querySelector("a").href
            href = href.split("/")
            return href[href.length - 1]
          })

          const description = await user.evaluate((e) => {
            let p = e.querySelector("p")
            return p != null ? p.innerText : "No description"
          })

          console.log("Username :", username, '|', "Description :", description)
        }
      }

      await this.page.waitForTimeout(2000)
    }
  }

  /**
   * Ends bot and close browser
   */
  async end() {
    await this.browser.close()
  }
}

module.exports = GithubBot
