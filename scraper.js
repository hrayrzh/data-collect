const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const puppeteer = require('puppeteer');

let arr = [];

// function delay(time) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }


// function generateUrls(start, end) {
//     const urls = [];
//     for (let i = start; i <= end; i++) {
//         urls.push(`https://factor.am/${i}.html`);
//     }
//     return urls;
// }

// const urls = generateUrls(744764, 744770);
const urls = ["https://lichess.org/account/profile", "https://lichess.org/account/profile   "];


// async function scrapeData(urls) {
//
//     let arr = []
//
//     for (const url of urls) {
//
//
//         await delay(500); // Задержка на 0.5 секунды
//
//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
//                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                     'Accept-Language': 'en-US,en;q=0.5',
//
//                     // Дополнительные заголовки по необходимости
//                 }
//             });
//
//             // Проверка статуса ответа
//             if (response.status === 404) {
//                 console.log(`Страница не найдена`);
//                 continue; // Пропускаем текущий URL и переходим к следующему
//             }
//
//             const html = response.data;
//             const $ = cheerio.load(html);
//
//             // Ваш код для извлечения данных
//             const text = $('a#user_tag').length ? $('a#user_tag').text() : $('h1').text();
//             console.log(text);
//             arr.push(text);
//         } catch (error) {
//             console.error(`Ошибка при запросе к ${url}: `);
//         }
//     }
//
//     app.get('/get-data', (req, res) => {
//         const data = arr;
//         res.json({message: data});
//     });
// }


async function scrapeData(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of urls) {
        try {

            await page.setExtraHTTPHeaders({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',

                // Добавьте другие заголовки по необходимости
            });
            await page.goto(url, {waitUntil: 'networkidle2'});
            // await delay(500); // Небольшая задержка

            // Выполнение клика на элемент
            await page.click('a[href="/account/preferences/display"]');

            // Ожидание, чтобы убедиться, что действия после клика выполнились
            await page.waitForSelector('.box__top'); // Убедитесь, что элемент загружен

            // Извлечение текста
            const text = await page.evaluate(() => {
                return document.querySelector('.box__top').innerText;
            });
            arr.push(text)
            console.log(text);
            // Здесь вы можете добавлять текст в массив или обрабатывать его другим способом

        } catch (error) {
            console.error(`Ошибка при запросе к ${url}: `, error);
        }


        app.get('/get-data', (req, res) => {
            const data = arr;
            res.json({message: data});
        });
    }

    await browser.close();
}

// Путь к вашему HTML файлу
const htmlFilePath = path.join(__dirname, "front", 'index.html');


// function appendDataToHtml(data) {
//     const dataHtml = `<p>${data}</p>`; // Форматируем данные для HTML
//
//     fs.readFile(htmlFilePath, 'utf8', (err, html) => {
//         if (err) {
//             console.error('Ошибка при чтении HTML файла:', err);
//             return;
//         }
//
//         // Добавляем новые данные перед закрывающим тегом </body>
//         const updatedHtml = html.replace('</body>', `${dataHtml}</body>`);
//
//         // Перезаписываем HTML файл с новыми данными
//         fs.writeFile(htmlFilePath, updatedHtml, 'utf8', (err) => {
//             if (err) {
//                 console.error('Ошибка при записи HTML файла:', err);
//             }
//         });
//     });
// }
//
//
// appendDataToHtml('Некоторые данные для добавления');


scrapeData(urls);


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'front')));
