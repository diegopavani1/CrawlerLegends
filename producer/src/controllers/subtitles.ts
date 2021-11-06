import puppeteer from 'puppeteer'
import Credentials from '../config/credentials.json'
import Cryptography from '../commons/cryptography'
import subtitlesInterface from '../interfaces/subtitles'
const kafka = require('kafka-node');
class Subtitles {
    url: string = 'http://legendas.tv/'
    cryptography: Cryptography = new Cryptography()
    credentials: any = {
        user: this.cryptography.decrypt(Credentials.user.rb, Credentials.user.valueEncrypted),
        password: this.cryptography.decrypt(Credentials.password.rb, Credentials.password.valueEncrypted)
    }
    startCrawler = async () => {
        const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
        const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions);
        const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);
        kafkaClient.on('error', (error: any) => console.error('Kafka client error:', error));
        kafkaProducer.on('error', (error: any) => console.error('Kafka producer error:', error));
        const browser = await puppeteer.launch(
            {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true,
                ignoreHTTPSErrors: true
            })
        const credentials = this.credentials
        const page = await browser.newPage()
        await page.goto(this.url)
        page.on('console', consoleObj => console.log(consoleObj.text()));
        await page.evaluate((credentials) => {
            let donateOverlay = document.querySelector("#overlay")
            if (donateOverlay) {
                (document.querySelector('#help-box-close') as HTMLButtonElement)
                    .click();
            }
            (document.querySelector('.js_entrar') as HTMLButtonElement)
                .click();
            (document.querySelector('input[name="data[User][username]"]') as HTMLInputElement)
                .setAttribute('value', credentials.user);
            (document.querySelector('input[name="data[User][password]"]') as HTMLInputElement)
                .setAttribute('value', credentials.password);
            (document.querySelector('input[value="Entrar"]') as HTMLButtonElement)
                .click();
        }, credentials)
        await page.waitForNavigation()
        await page.evaluate(() => {
            (document.querySelector('#likebox-close') as HTMLButtonElement)
                .click()
        })
        await page.evaluate(() => {
            (document.querySelector('#search-box') as HTMLInputElement)
                .setAttribute('value', 'Breaking Bad');
            (document.querySelector('input[type=submit].icon_zoom') as HTMLButtonElement)
                .click();
        })
        await page.waitForNavigation()

        const subtitlesItems: subtitlesInterface[] = await page.evaluate(async () => {
            // @ts-ignore
            const subtitlesSections: any = document.querySelector(
                'body > div[class="container"] > div[class="middle busca"] > div[id="resultado_busca_cont"] > section[id="resultado_busca"] > div[class="gallery clearfix list_element"] ').querySelectorAll('article > div'
            )
            const subtitlesItems: subtitlesInterface[] = []
            subtitlesSections.forEach((subtitle: any) => {
                const subtitleHtml = subtitle.querySelector('div')
                const name = subtitleHtml.querySelector('a').outerText.replace(/ /g,'');
                const data = subtitleHtml.querySelector('p[class="data"]').outerText.split(',')
                const downloads = parseFloat(data[0].match(/\d+/g))
                const link: string = subtitleHtml.querySelector('a[href]').getAttribute('href')
                const nota = parseFloat(data[1].match(/\d+/g))
                const dataSent = data[2].toString().replace('enviado por', '').split('em')
                const whoSent = dataSent[0].replace(/ /g,'')
                const dateSent = dataSent[1].replace(/ /g,'')
                const languague = subtitle.querySelector('img').getAttribute('title')
                subtitlesItems.push({
                    name: name,
                    dateSent: dateSent,
                    downloadLink: link,
                    language: languague,
                    likeRatio: 0,
                    note: nota,
                    qtdDownloads: downloads,
                    whoSent: whoSent
                })
            });
            return subtitlesItems
        })
        let i = 0
        for await (const item of subtitlesItems) {
            await page.goto(`${this.url}${item.downloadLink}`)
            const likes = await page.evaluate(async (i) => {
                // @ts-ignore
                const ratioSection: any = document.querySelector(
                    'body > div[class="container"] > div[class="middle download"]').querySelectorAll('section'
                )[1].querySelectorAll('aside')[2].querySelectorAll('p')
                let likes = 0
                let unlikes = 0
                if(ratioSection[0].outerText.length > 0) {
                    likes = parseInt(ratioSection[0].outerText)
                }
                if(ratioSection[1].outerText.length > 0) {
                   unlikes = parseInt(ratioSection[1].outerText)
                }
                return {
                    likes,
                    unlikes
                }
            })
            if (likes.likes > 0 && likes.unlikes > 0){
                subtitlesItems[i].likeRatio = (Math.round((likes.likes / likes.unlikes) * 100) / 100)
            } else {
                subtitlesItems[i].likeRatio = 0.00
            }
            const message = subtitlesItems[i]
            const payload = [{
                topic: 'subtitles-topic',
                messages: JSON.stringify(message),
                attributes: 1
            }]
            kafkaProducer.send(payload, function(error: any, result: any) {
                console.log('ENVIANDO legendas para a fila')
                if (error) {
                    console.error('Falha ao enviar legenda para fila :', error)
                }
            })
            i++
        }
        console.log(`Foram encontradas ${subtitlesItems.length + 1} legendas`)
    }
}
export  = Subtitles