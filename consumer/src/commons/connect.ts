import mongoose  from "mongoose"
const connect = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://database:27017/implus').then(r => {
            resolve(mongoose.connection)
        }).catch(err => {
            reject(err)
        })
    })
}
export = connect