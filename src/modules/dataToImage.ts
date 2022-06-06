import fs from "fs";
import { Attachment } from "../database/models/Message";
import { _DBHelpers } from "./helpers";
import { promisify } from "util";

const read = promisify(fs.readFile);

export default function dataToImage(files: Attachment[]): string[] {

    return files.map((file: Attachment) => {
        return `<img class="sentImage" src="/message/image/${file.name}" alt=""></img>`
       
    })
}

export function imageSlider (files: Attachment[]): string[] {
    return files.map((f: Attachment, i: number) => {
        return `
        <img class="slide ${i === 0 ? "active" : "hide"}" src="/message/image/${f.name}">
        `
    })
}