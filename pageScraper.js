const scraperObject = {
    filmUrls: ['https://www.imdb.com/title/tt4500922/reviews?ref_=tt_urv',
        'https://www.imdb.com/title/tt7136896/reviews?ref_=tt_urv',
        'https://www.imdb.com/title/tt0068646/reviews?ref_=tt_urv',
        'https://www.imdb.com/title/tt0103639/reviews?ref_=tt_urv',
        'https://www.imdb.com/title/tt0380389/reviews?ref_=tt_urv'],
    async scraper(browser) {
        let page = await browser.newPage();
        let filmsDataArray = [];
        // Пробегаемся по массиву фильмов
        for (const film of this.filmUrls) {
            console.log(`Navigating to ${film}`);
            try {
                // Ждем перехода на страницу и ее загрузки
                await Promise.all([
                    page.waitForNavigation(),
                    page.goto(film),
                    page.waitForSelector('#main'),
                ]);
                let filmData = {};
                // Получаем имя фильма
                filmData['filmName'] = await page.$eval("h3 a[itemprop='url']", name => name.textContent);
                // Получаем массив отзывов по фильму
                filmData['filmReviews'] = await page.$$eval(".lister-item-content", listItems => {
                    return listItems.filter(listItem => !listItem.querySelector('.spoiler-warning'))
                        .map(item => ({
                                starsCount: item.querySelector('svg + span')?.textContent,
                                reviewTitle: item.querySelector('a.title')?.textContent,
                                reviewContent: item.querySelector('.content > .text')?.textContent,
                            }
                        ))
                });
                filmsDataArray.push(filmData);
            } catch (e) {
                console.log(`На странице ${film} что-то пошло не так`)
            }
        }
        return filmsDataArray;
    }
}

module.exports = scraperObject;