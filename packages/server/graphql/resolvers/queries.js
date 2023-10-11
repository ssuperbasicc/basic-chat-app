const  { knexQ } = require('../../plugins/knex')
const { dayJS } = require('../../plugins/dayjs')


const rooms = async (p, args, ctxV, info) => {
    let data = []

    data = await knexQ('app_pub.v_rooms')
    .select(
        'id',
        'name',
        'name_format as nameFormat',
        'flag_forum as flagForum',
        'create_ts as createTs',
        'last_message_ts as lastMessageTs'
    )
    .where('user_id', args.userId)

    data.forEach((d, i) => {
        d.lastMessageTs = dayJS(d.lastMessageTs).utc(true).format() 
    })

    return data
}

const conversations = async (p, args, ctxV, info) => {
    const { 
        roomId,
        offset,
        limit
     } = args

    let havingNext = false

    let bindParams = [roomId]

    let q1 = `
        select
            a.id as id,
            a.sender_id as sender,
            a.text as text,
            a.create_ts as ts
        from 
            app_pub.messages as a
        where
            a.room_id = ?::integer
    `

    let q2 = `
        order by
            id desc
        limit
            ?::integer
    `

    if (offset > 0){
        q1 = `${q1} and id < ?::integer`
        bindParams = [...bindParams, offset]
    }

    const finalQuery = `${q1}${q2}`
    const finalParams = [...bindParams, parseInt(limit) + 1]

    const data = await knexQ.raw(finalQuery, finalParams)

    data.rows.forEach((d, i) => {
        d.ts = dayJS(d.ts).utc(true).format()       
    })

    if (data.rows.length > limit) {
        havingNext = true
        data.rows.pop()
    }

    return { messages: data.rows.reverse(), havingNext }
}

const accountInfos = async (p, args, ctxV, info) => {
    const { userId } = args

    const data = await knexQ({
        a: 'app_pub.users',
        b: 'app_priv.user_secrets'
    })
    .select(
        'a.id as id',
        'a.first_name as firstName',
        'a.last_name as lastName',
        'a.username as username'
    )
    .whereRaw("?? = ??", ['a.id', 'b.id'])
    .where('a.id', userId)

    return data[0]
}

module.exports = {
    rooms,
    conversations,
    accountInfos
}