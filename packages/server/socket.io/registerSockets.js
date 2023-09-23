const EH = require('./eventHandlers')

const SOCKETS = [
    {
        eventMode: "on",
        eventName: "JOIN_ROOM",
        eventHandler: EH.joinRoom
    },
    {
        eventMode: "on",
        eventName: "SEND_MESSAGE",
        eventHandler: EH.sendMessage
    }
]

module.exports = { SOCKETS }