import WebDriver from 'webdriver';

const client = WebDriver.newSession({
    path: '/',
    capabilities: { browserName: 'chrome' }
});

client.navigateTo('https://www.baidu.com');
