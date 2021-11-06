import connect from './commons/connect';
import consumer from './controllers/consumer';
connect().then(async res => {
    console.log('Conectado ao mongodb com sucesso!')
    await consumer()
}).catch(err => {
    /// erro de conexao ao banco de dados
    console.log(err)
})

