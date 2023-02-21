const browserObject = require('./browser');
const scraperController = require('./pageController');
const express = require('express');
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
const PORT = 5000;
const router = express.Router();
const app = express();
app.use(express.json({extended: true}));
app.use(cors(corsOptions));

app.use('/api/data', router.get('/', async (req, res) => {
    try {
        //Запускает браузер и создает инстанс браузера
        let browserInstance = browserObject.startBrowser();
        // Передает инстанс браузера в scraper controller
        const data = await scraperController(browserInstance);
        res.json(data);
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
}));

async function start() {
    try {
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log("Server Error", e.message)
        process.exit(1)
    }
}

start();