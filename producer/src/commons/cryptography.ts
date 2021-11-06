import * as crypto from 'crypto'
class Cryptography {
    typeAlgorithm: string = 'aes-256-ctr'
    sKey:string = 'alkdaksjdsakjdklasjopioiqwieqwop'
    encrypt = (value: string) => {
        const rb = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(this.typeAlgorithm, this.sKey, rb)
        // @ts-ignore
        const valueEncrypted = Buffer.concat([cipher.update(value), cipher.final()])

        return {
            rb: rb.toString('hex'),
            valueEncrypted: valueEncrypted.toString('hex')
        }
    }
    decrypt = (rb: string, valueEncrypted: string) => {
        const ucipher = crypto.createDecipheriv(
            this.typeAlgorithm,
            this.sKey,
            // @ts-ignore
            Buffer.from(rb, 'hex'))
        // @ts-ignore
        const decrpyted = Buffer.concat(
            [
                // @ts-ignore
                ucipher.update(Buffer.from(valueEncrypted, 'hex')),
                ucipher.final()
            ])

        return decrpyted.toString()
    }
}
export = Cryptography