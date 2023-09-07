-- POSTGRESQL v14

-- schema definition
create schema app_priv; 
create schema app_pub;

-- extension definition
create extension if not exists pgcrypto;

-- user managements
create table if not exists app_pub.users (
    id bigserial primary key, 
    first_name character varying(32),
    last_name character varying(32),
    username character varying(64) not null unique,
    create_ts timestamp not null default now()
);

create table if not exists app_priv.user_secrets (
    id bigint not null references app_pub.users (id) on delete cascade,
    email character varying(128) not null,
    password text not null
);

-- chat and group managements
create table if not exists app_pub.chat_rooms (
    id bigserial primary key,
    person_1 bigint not null references app_pub.users (id) on delete cascade,
    person_2 bigint not null references app_pub.users (id) on delete cascade,
    last_message_ts timestamp
);

create table if not exists app_pub.chat_messages (
    id bigserial primary key,
    chat_room_id bigint not null references app_pub.chat_rooms (id) on delete cascade,
    sender_id bigint not null references app_pub.users (id) on delete cascade,
    text text not null,
    create_ts timestamp not null default now()
);

create table if not exists app_pub.group_rooms (
    id bigserial primary key,
    name character varying(64) not null,
    create_ts timestamp not null default now()
);

create table if not exists app_pub.group_room_members (
    group_room_id bigint not null references app_pub.group_rooms (id) on delete cascade,
    user_id bigint not null references app_pub.users (id) on delete cascade,
    primary key (group_room_id, user_id)
);

create table if not exists app_pub.group_messages (
    id bigserial primary key,
    group_room_id bigint not null references app_pub.group_rooms (id) on delete cascade,
    sender_id bigint not null references app_pub.users (id) on delete cascade,
    text text not null,
    create_ts timestamp not null default now()
);
