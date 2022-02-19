module.exports = function (number, code) {
    client = require("twilio")(
        process.env.TWILLIO_SID,
        process.env.TWILLIO_TOKEN
    );

    client.messages
        .create({
            body: code.toString(),
            messagingServiceSid: process.env.TWILLIO_MSID,
            to: "+" + number,
        })
        .then((message) => console.log(message.sid))
        .done();
};
