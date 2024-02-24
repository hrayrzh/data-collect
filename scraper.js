const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function generateUrls(start, end) {
    const urls = [];
    for (let i = start; i <= end; i++) {
        urls.push(`https://factor.am/${i}.html`);
    }
    return urls;
}

// const urls = generateUrls(744764, 744770);
const urls = ["https://trello.com/b/jsc44AXI/map", "https://trello.com/b/c0fYpD3C/a"];


async function scrapeData(urls) {

    let arr = []

    for (const url of urls) {


        await delay(500); // Задержка на 0.5 секунды

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Cookie' : 'ajs_anonymous_id=%22143960c1-0f9a-1de1-1c61-c464cd0b6fb9%22; idMember=5e12460ca2db4262a9c22d01; __cid=Xloe3I_QMDz4GV7_1gpAoQ5_ObTXe-XiY0Jn_HNFcqxHxWx_AG50yWR9YbuQQyP-HRylWzdGHm9iSzPwYDwIky0sFpUMLw3TVW1c3EgUBZIELBuPQA043FFzQsxbYzuVDnVYx0A7WshJYy2MEC8JqwUhJ5UUbFnPV21fykBrJ7Q0DiDQQC8FlwVjK5kDKAPVQAAEjg8uCdNRcVzSUG1c0lBjP50GIh6VT3Zfy05wWpBoJ1XFWHRUylE0b_sayGxoaHZez1klCs5X3zi9LgQguUBrJZIUJgDQQAoCiAUvRK5JYyS4QAQenRArBZ8TY1rOUGNEzBhzXMxQdlXNVmpMuAkxCZ8UcCjNUWMajz92M8xAMx-jVRxc0EAHX7hRckVYdHNd0lByQs1ZdFzQQHNYxlBzVsxQ7GT81WKpTWKIbC9hnu-qh2uH_5cYUtyoqZP-KINs_GBDbPxgQ2z8YENs_GBDbPxgQ2z8YENs_GBDbPxgQ2y8IAMsvCBDbPxgQ2z8YENs_GADbPxgQ2z8YENs_GC8; lang=ru; dsc=ac6187fd5d940421091301f0f2d77815567557c30f9a851688ce2388f642551c; loggedIn=1; aaId=70121%3A8e17846a-4540-485c-9102-77178638ce85; atlCohort={"bucketAll":{"bucketedAtUTC":"2024-02-24T09:44:37.649Z","version":"2","index":37,"bucketId":0}}; atl_xid.ts=1708767880051; atl_xid.current=%5B%7B%22type%22%3A%22xc%22%2C%22value%22%3A%2263ee5561-1ad9-4287-9c5e-6794b82d45c6%22%2C%22createdAt%22%3A%222024-02-24T09%3A44%3A40.038Z%22%7D%5D; _gcl_au=1.1.1084556880.1708767880; _mkto_trk=id:594-ATC-127&token:_mch-trello.com-1708767880763-89914; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Feb+24+2024+13%3A44%3A40+GMT%2B0400+(%D0%90%D1%80%D0%BC%D0%B5%D0%BD%D0%B8%D1%8F%2C+%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%BE%D0%B5+%D0%B2%D1%80%D0%B5%D0%BC%D1%8F)&version=202308.2.0&browserGpcFlag=0&isIABGlobal=false&consentId=70121%3A8e17846a-4540-485c-9102-77178638ce85&hosts=&landingPath=https%3A%2F%2Ftrello.com%2Fru&groups=1%3A1%2C2%3A1%2C3%3A1%2C4%3A1; atl_session=54056070-ddd6-4607-8426-668878d81c93; atlUserHash=1393648548; cloud.session.token=eyJraWQiOiJzZXNzaW9uLXNlcnZpY2UvcHJvZC0xNTkyODU4Mzk0IiwiYWxnIjoiUlMyNTYifQ.eyJhc3NvY2lhdGlvbnMiOltdLCJzdWIiOiI3MDEyMTo4ZTE3ODQ2YS00NTQwLTQ4NWMtOTEwMi03NzE3ODYzOGNlODUiLCJlbWFpbERvbWFpbiI6ImdtYWlsLmNvbSIsImltcGVyc29uYXRpb24iOltdLCJjcmVhdGVkIjoxNzA1NTE5ODQ5LCJyZWZyZXNoVGltZW91dCI6MTcwODc2ODg2OCwidmVyaWZpZWQiOnRydWUsImlzcyI6InNlc3Npb24tc2VydmljZSIsInNlc3Npb25JZCI6IjE5NWI1MjZmLTYxZjEtNDk4NC1iMGIyLTJmYzdhOGFmM2E1ZCIsInN0ZXBVcHMiOltdLCJhdWQiOiJhdGxhc3NpYW4iLCJuYmYiOjE3MDg3NjgyNjgsImV4cCI6MTcxMTM2MDI2OCwiaWF0IjoxNzA4NzY4MjY4LCJlbWFpbCI6ImhyLnpvaHJhYnlhbkBnbWFpbC5jb20iLCJqdGkiOiIxOTViNTI2Zi02MWYxLTQ5ODQtYjBiMi0yZmM3YThhZjNhNWQifQ.yIsBJhT685gMr6tMEesbWg_cNO5Jz87mCvckW1GxyVu7fBolmKv1cBO5IX35OgcODePTNpv51sjHbqtL4N88PaW14-96XBRWR21rRww4uv3URanlRsm5LVFE3hrN2ujAFyUZUv06l11Lb6yoKY3R7y8-UWMp_TupID5Snd0yQj7K0MvQNEixLA8AR9XSM3jjwNjSpv4dM1fZkuycTzj70BHjvAF35AluaKr0zZ1JZAPdyqpcTqN8M4xg7D6HTWyx-epDoDt8W9_yRvL0RJtLe0b6Dn2zS-7orFSRlmWJD6DBcr61KgmDWAbiVFat_TigEsELCKhoUBTwH2OvkS8gxA',
                    'Atl-Traceid' : '82af19fcf92b49f2be7174e917b797f1',
                    'Content-Security-Policy' : 'base-uri \'none\'; default-src \'self\'; script-src \'strict-dynamic\' \'nonce-00e0fc7d02cb4ecf9a44a2fe2f898491\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com/css https://infinity-spike-extension.us-east-1.prod.public.atl-paas.net *.walkme.com; img-src \'self\' http: https: data: *.walkme.com s3.walkmeusercontent.com d3sbxpiag177w8.cloudfront.net; font-src \'self\' data: https://fonts.gstatic.com *.walkme.com; frame-ancestors \'none\'; form-action \'self\' https://id.atlassian.com; report-uri https://web-security-reports.services.atlassian.com/csp-report/trello-edge; connect-src \'self\' ws: wss: http://594-atc-127.mktoresp.com https://api.atlassian.com https://api.company-target.com https://api.giphy.com https://apis.google.com https://accounts.google.com https://bat.bing.com https://cdn.linkedin.oribi.io https://dc.ads.linkedin.com https://fd-assets.prod.atl-paas.net https://flight-deck-assets-bifrost.prod-east.frontend.public.atl-paas.net https://fd-config.us-east-1.prod.public.atl-paas.net https://fd-config-bifrost.prod-east.frontend.public.atl-paas.net https://graph.microsoft.com https://gw.linkedin.oribi.io https://k-aus1.clicktale.net https://maps.googleapis.com https://o55978.ingest.sentry.io https://px.ads.linkedin.com https://px4.ads.linkedin.com https://p.adsymptotic.com https://sjs.bizographics.com https://snap.licdn.com https://q-aus1.clicktale.net https://q.quora.com https://app.launchdarkly.com https://events.launchdarkly.com https://cdn.cookielaw.org https://*.onetrust.com https://optanon.blob.core.windows.net https://views.unsplash.com https://unpkg.com/pdfjs-dist@2.13.216/ *.walkme.com https://statsigapi.net https://xp.atlassian.com https://api-gateway.trello.com https://trello-slack.services.atlassian.com https://janus.prod.atl-paas.net; object-src \'none\'; worker-src blob: \'self\' *.walkme.com; frame-src \'self\' https: blob: http://5406241.fls.doubleclick.net/ *.walkme.com',

                    // Дополнительные заголовки по необходимости
                }
            });

            // Проверка статуса ответа
            if (response.status === 404) {
                console.log(`Страница не найдена`);
                continue; // Пропускаем текущий URL и переходим к следующему
            }

            const html = response.data;
            const $ = cheerio.load(html);

            // Ваш код для извлечения данных
            const text = $('h1').length ? $('h1').text() : $('h2').text();
            console.log(text);
            arr.push(text);
        } catch (error) {
            console.error(`Ошибка при запросе к ${url}: `);
        }
    }

    app.get('/get-data', (req, res) => {
        const data = arr;
        res.json({message: data});
    });
}


// Путь к вашему HTML файлу
const htmlFilePath = path.join(__dirname, "front", 'index.html');


function appendDataToHtml(data) {
    const dataHtml = `<p>${data}</p>`; // Форматируем данные для HTML

    fs.readFile(htmlFilePath, 'utf8', (err, html) => {
        if (err) {
            console.error('Ошибка при чтении HTML файла:', err);
            return;
        }

        // Добавляем новые данные перед закрывающим тегом </body>
        const updatedHtml = html.replace('</body>', `${dataHtml}</body>`);

        // Перезаписываем HTML файл с новыми данными
        fs.writeFile(htmlFilePath, updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error('Ошибка при записи HTML файла:', err);
            }
        });
    });
}


appendDataToHtml('Некоторые данные для добавления');


scrapeData(urls);


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'front')));
