const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

function analyzeText(text) {
    // Избавляемся от сокращений в английском языке
    const lexedText = aposToLexForm(text);

    // Переводим весь текст в нижний регистр
    const casedText = lexedText.toLowerCase();

    // Оставляем в тексте только буквы
    const letterOnly = casedText.replace(/[^a-zA-Z\s]+/g, '')

    // Разбиваем текст на токены
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedText = tokenizer.tokenize(letterOnly);

    // Исправляем ошибки в словах, если они есть
    tokenizedText.forEach((word, index) => {
        tokenizedText[index] = spellCorrector.correct(word);
    });

    // Удаляем слова, которые никак не влияют на анализ тональности
    const filteredReview = SW.removeStopwords(tokenizedText);

    // ОбЪявляем инструмент для анализа тональности
    // 'English' -  язык текста, PorterStemmer - приведем слова к нормальному виду (суффиксы...), afinn - наш словарь тональности
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

    // Получаем и возвращаем наш результат тональности
    return analyzer.getSentiment(filteredReview);
}


module.exports = analyzeText;