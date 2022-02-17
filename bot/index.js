class IgBot {
  constructor() {
    this.config = require("./config/config.json")
  }

  /**
   * Initialise Chromium et ouvre Instagram
   */
  async init() {
    const puppeteer = require("puppeteer")
    const creds = require("../creds")
    this.browser = await puppeteer.launch(this.config.settings)

    // Ouverture d'un onglet
    this.page = await this.browser.newPage()

    // Navigation vers l'URL défini
    await this.page.goto(this.config.base_url)

    // On attend que le body soit chargé
    await this.page.waitForSelector("body")
  }

  /**
   * Ends bot and close browser
   */
  async end() {
    await this.browser.close()
  }
}

module.exports = IgBot
