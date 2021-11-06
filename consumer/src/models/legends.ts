import { Schema, model } from 'mongoose'

interface legendsInterface {
    name: string;
    qtdDownloads: number;
    note: number,
    likeRatio: number,
    whoSent: string,
    dateSent: string,
    language: string,
    downloadLink: string
}
const legendsSchema = new Schema<legendsInterface>({
    name: { type: String, required: true },
    qtdDownloads: { type: Number, required: true },
    note: { type: Number, required: true },
    likeRatio: { type: Number, required: true },
    whoSent: { type: String, required: true },
    dateSent: { type: String, required: true },
    language: { type: String, required: true },
    downloadLink: { type: String, required: true }
})
const LegendsModel = model<legendsInterface>('Legends', legendsSchema)
export = LegendsModel