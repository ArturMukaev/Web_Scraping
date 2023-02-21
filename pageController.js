const pageScraper = require('./pageScraper');
const analyzeText = require('./textAnalysis');

async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        const data = await pageScraper.scraper(browser);
        await browser.close();
        const twoVariables = [['Review','Rating', 'Tonality']];
        let totalFilmsForGraphic = 0;
        for (const filmData of data) {
            console.log("Фильм: " + filmData.filmName + ":");
            console.log('-----------------------------------')
            let totalNumberOfStars = 0;
            let totalNumberOfReviewsWithStars = 0;
            let totalNumberOfTonality = 0;
            for (const reviewData of filmData.filmReviews) {
                const {starsCount, reviewTitle, reviewContent} = reviewData;
                const tonality = Math.round(analyzeText(`${reviewTitle} ${reviewContent}`) * 100);
                totalNumberOfTonality += tonality;
                console.log(`Тональность: ${tonality} %`);
                if (starsCount) {
                    totalNumberOfStars += parseInt(starsCount);
                    totalNumberOfReviewsWithStars++;
                    let starsForGraphic = (parseInt(starsCount) - 5) * 20;
                    totalFilmsForGraphic++;
                    twoVariables.push([totalFilmsForGraphic,starsForGraphic,tonality]);
                    console.log(`Оценка: ${starsCount} /10`);
                }
                console.log('-----------------------------------');
            }
            console.log(`Средний рейтинг фильма: ${Math.round(totalNumberOfStars / totalNumberOfReviewsWithStars)} /10`);
            console.log(`Средняя тональность фильма: ${Math.round(totalNumberOfTonality / filmData.filmReviews.length)} %`);
            console.log('-----------------------------------');
        }
        return twoVariables;
    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)