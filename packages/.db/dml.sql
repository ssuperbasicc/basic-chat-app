-- POSTGRESQL v14

-- generate default user
    -- user 1
insert into app_pub.users (
    first_name,
    last_name,
    username
) values (
    'FLOP',
    'MUNCHERO',
    'user1'
);

insert into app_priv.user_secrets (
    id,
    email,
    password
) values (
    1,
    'user1@gmail.com',
    crypt(
        format('%s:%s', 'user1@gmail.com', 'password'),
        gen_salt('bf', 10)
    )
);
    
    -- user 2
insert into app_pub.users (
    first_name,
    last_name,
    username
) values (
    'DIAZ',
    'VULSTANDIG',
    'user2'
);

insert into app_priv.user_secrets (
    id,
    email,
    password
) values (
    2,
    'user2@gmail.com',
    crypt(
        format('%s:%s', 'user2@gmail.com', 'password'),
        gen_salt('bf', 10)
    )
);