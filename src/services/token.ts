const day = 1000 * 60 * 60 * 24;

let token = "";
let token_expiration_datetime = new Date();

function makeid(length: number) {
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


function generateNewToken() {
    token_expiration_datetime = new Date(new Date().getTime() + (day * 180));
    token = makeid(64);
    return { token, token_expiration_datetime };
}

function validToken(sentToken: string) {
    if (sentToken == token && new Date() < token_expiration_datetime) {
        return true;
    }
    return false;
}

export { generateNewToken, validToken };
