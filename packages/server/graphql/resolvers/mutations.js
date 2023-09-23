const { knexQ } = require('../../plugins/knex')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const {
    SERVICE_TOKEN_SECRET,
    SERVICE_TOKEN_EXPIRED
} = process.env

const login = async (p, args, ctxV, info) => {
    const { email, password } = args

    const userRows = await knexQ({
        a: 'app_pub.users',
        b: 'app_priv.user_secrets'
    })
    .select('a.*')
    .whereRaw("?? = ??", ['a.id', 'b.id'])
    .where('email', email)
    .whereRaw(
        "crypt(format('%s:%s', b.email, ?::text), b.password) = b.password",
        [password]
    )

    if (userRows.length === 0) {
        throw new GraphQLError(
            "Unauthorized.",
            {
                extensions: { code: 'UNATHORIZED' }
            }
        )
    }

    const userRow = userRows[0]

    const token = jwt.sign(
        {
            aud: userRow.id
        },
        SERVICE_TOKEN_SECRET,
        {
            expiresIn: SERVICE_TOKEN_EXPIRED
        }
    )

    return { token }
}

const register = async (p, args, ctxV, info) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password
    } = args.data

    let user = []

    await knexQ.transaction(async tx => {
        user = await tx('app_pub.users').insert({
            first_name: firstName?.toUpperCase(),
            last_name: lastName?.toUpperCase(),
            username: username.toLowerCase()           
        }, [ 
            'id',
            'first_name',
            'last_name', 
            'username'
        ])

        await tx.raw(`
            insert into app_priv.user_secrets (
                id,
                email,
                password
            ) values (
                ?::integer,
                ?::text,
                crypt(
                    format('%s:%s', ?::text, ?::text),
                    gen_salt('bf', 10)
                )
            )
        `, [
            user[0].id,
            email,
            email,
            password
        ])
    })

    return { 
        id: user[0].id,
        firstName: user[0].first_name,
        lastName: user[0].last_name, 
        username: user[0].username
    }
    
}

module.exports = {
    login,
    register
}