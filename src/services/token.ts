const day = 1000 * 60 * 60 * 24;

let token = '';
let token_expiration_datetime = new Date();

const tokens: {
    [uuid: string]: {
        token: string;
        token_expiration_datetime: Date;
    };
} = {};

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


function generateNewToken(uuid: string) {
    token_expiration_datetime = new Date(new Date().getTime() + (day * 180));
    token = makeId(64);

    tokens[uuid] = { token, token_expiration_datetime };

    return tokens[uuid];
}

function validToken(sentToken: string) {

    for (const token of Object.values(tokens)) {
        if (sentToken == token.token && new Date() < token.token_expiration_datetime) {
            return true;
        }
    }

    return false;
}

export { generateNewToken, validToken };
