/**
 * La fonction valide les emails et retourne un tableau avec les différentes parties de l'email si l'email est correct, sinon elle retourne null
 * https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript#46181
 * @param {string} email
 * @returns {array|null}
 */
function validateEmail(email: string): RegExpMatchArray | null {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export default validateEmail ;