const { randomPinNumber } = require('../../utils/randomGenerator');
const {ResetPinSchema} = require('./ResetPin.schema');

const setPasswordResetPin = async (email) => {

    const pinLength = 6
    const randPin = await randomPinNumber(pinLength)

    const restObj = {
        email,
        pin: randPin
    }

    return new Promise((resolve, reject) => {
        ResetPinSchema(restObj)
            .save()
            .then((data) => resolve(data))
            .catch((error) => reject(error))
    });
};

module.exports = {
    setPasswordResetPin,
}