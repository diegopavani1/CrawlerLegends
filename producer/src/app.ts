import Subtitles from './controllers/subtitles'
const subtitles: Subtitles = new Subtitles();
subtitles.startCrawler().then((r: any) => {
    console.log('terminou de rodar job')
})