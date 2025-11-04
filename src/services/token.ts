import moment from 'moment';
import { database } from './database.js';

export interface Token {
    [uuid: string]: {
        token: string;
        token_expiration_datetime: Date;
    };
}

function makeId(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


async function generateNewToken(uuid: string) {
    const token_expiration_datetime = new Date(new Date().getTime() + moment.duration(180, 'days').asMilliseconds());
    const token = makeId(64);

    const db = await database.init();

    db.data.tokens[uuid] = { token, token_expiration_datetime };

    await db.write();

    return db.data.tokens[uuid];
}

async function validToken(sentToken: string) {

    const db = await database.init();

    const token = Object.values(db.data.tokens).find(t => t.token === sentToken);

    if (token && token.token_expiration_datetime > new Date()) {
        return true;
    }

    return false;
}

export { generateNewToken, validToken };
