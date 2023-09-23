const { knexQ } = require('../plugins/knex')

const joinRoom = (socket, data) => {
    try {
        const { roomId } = data

        socket.join(parseInt(roomId))

        console.debug(`User with ID: ${socket.id} joined room ID: ${roomId}`)
    } catch (error) {
        console.debug('ERROR =>', error.message)
    }
}

const sendMessage = async (socket, data) => {
    try {
        const {
            roomId,
            senderId,
            text
        } = data

        let id = 0
        let create_ts = ""

        await knexQ.transaction(async tx => {
            const ids = await tx('app_pub.messages')
            .insert({
                room_id: roomId,
                sender_id: senderId,
                text
            }, [
                'id',
                'create_ts'
            ])

            id = ids[0].id
            create_ts = ids[0].create_ts

            await tx('app_pub.rooms')
            .where('id', roomId)
            .update({
                last_message_ts: create_ts
            })
        })

        socket
        .to(parseInt(roomId))
        .emit("MESSAGE_SENT", {...data, id, create_ts})

    } catch (error) {
        console.debug('ERROR =>', error.message)
    }
}

module.exports = {
    joinRoom,
    sendMessage
}