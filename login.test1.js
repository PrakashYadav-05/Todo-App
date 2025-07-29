
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('React App UI Automation', function () {
  this.timeout(30000); // increase timeout if needed

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000');
  });

  after(async () => {
    await driver.quit();
  });

  it('Login with valid credentials', async () => {
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginBtn = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('test@example.com');
    await passwordInput.sendKeys('password123');
    await loginBtn.click();

    await driver.wait(until.elementLocated(By.css('p')), 5000);

    const successMessage = await driver.findElement(By.css('p')).getText();
    expect(successMessage).to.equal('Login successful!');
  });
});
