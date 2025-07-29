
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('React App UI Automation', function () {
  this.timeout(40000); // increase timeout

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000');
  });

  after(async () => {
    await driver.quit();
  });

  async function login(email, password) {
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginBtn = await driver.findElement(By.id('login-button'));

    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);
    await loginBtn.click();
  }

  it('Login with valid credentials', async () => {
    await login('test@example.com', 'password123');

    // Wait for Todo List header to confirm successful login
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    const heading = await driver.findElement(By.css('h2')).getText();
    expect(heading).to.equal('Todo List');
  });

  it('Login with invalid credentials shows alert', async () => {
    // Refresh page to get back to login screen
    await driver.navigate().refresh();

    await login('wrong@example.com', 'wrongpass');

    // Check for alert window (use driver.switchTo().alert())
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    expect(alertText).to.equal('Invalid credentials');
    await alert.accept();
  });

  it('Create a new todo item', async () => {
    // Login first (if not already)
    await driver.get('http://localhost:3000');
    await login('test@example.com', 'password123');
    await driver.wait(until.elementLocated(By.css('input[placeholder="New Todo"]')), 5000);

    const newTodoInput = await driver.findElement(By.css('input[placeholder="New Todo"]'));
    const addButton = await driver.findElement(By.css('button'));

    await newTodoInput.sendKeys('Write Selenium test');
    await addButton.click();

    // Wait for todo to appear in list
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Write Selenium test')]")), 5000);

    const todoText = await driver.findElement(By.xpath("//li[contains(text(), 'Write Selenium test')]")).getText();
    expect(todoText).to.include('Write Selenium test');
  });

  it('Edit an existing todo item', async () => {
    // Find the todo we just added
    const todoListItem = await driver.findElement(By.xpath("//li[contains(text(), 'Write Selenium test')]"));

    // Click Edit button next to it
    const editButton = await todoListItem.findElement(By.xpath(".//button[contains(text(), 'Edit')]"));
    await editButton.click();

    // Find the input inside edit mode and update text
    const editInput = await todoListItem.findElement(By.css('input'));
    await editInput.clear();
    await editInput.sendKeys('Updated Selenium test');

    // Click Save button
    const saveButton = await todoListItem.findElement(By.xpath(".//button[contains(text(), 'Save')]"));
    await saveButton.click();

    // Wait for update and check new text
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Updated Selenium test')]")), 5000);

    const updatedText = await driver.findElement(By.xpath("//li[contains(text(), 'Updated Selenium test')]")).getText();
    expect(updatedText).to.include('Updated Selenium test');
  });

  it('Delete an existing todo item', async () => {
    // Find the updated todo
    const todoListItem = await driver.findElement(By.xpath("//li[contains(text(), 'Updated Selenium test')]"));

    // Click Delete button
    const deleteButton = await todoListItem.findElement(By.xpath(".//button[contains(text(), 'Delete')]"));
    await deleteButton.click();

    // Wait a moment and confirm item is gone
    await driver.sleep(1000); // wait a second for deletion

    const todos = await driver.findElements(By.xpath("//li[contains(text(), 'Updated Selenium test')]"));
    expect(todos.length).to.equal(0);
  });
});
