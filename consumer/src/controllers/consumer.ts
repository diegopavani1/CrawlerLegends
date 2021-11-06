const kafka = require('kafka-node')
import SubtitlesModel from '../models/subtitle'
const consumer = async () =>{
        const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 }
        const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'consumer-client', kafkaClientOptions)
        const topics = [
            { topic: 'subtitles-topic' }
        ]
        const kafkaConsumer = new kafka.HighLevelConsumer(kafkaClient, topics)
        kafkaConsumer.on('message', async function(message: any) {
                console.log('RECEBENDO legenda e salvando');
                /// salva no mongo db
                const subtitle = JSON.parse(message.value);
                await SubtitlesModel.create(subtitle);
        })
        kafkaClient.on('error', (error: any) => console.error('Kafka client error:', error))
        kafkaConsumer.on('error', (error: any) => console.error('Kafka consumer error:', error))
}
export = consumer