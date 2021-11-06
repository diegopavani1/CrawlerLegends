import Legends from './controllers/legends'
const legends: Legends = new Legends();
legends.startCrawler().then(r => {
    console.log('terminou de rodar job')
})