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
create table if not exists app_pub.rooms (
    id bigserial primary key,
    name text not null,
    name_format json not null default '{}',
    flag_forum boolean not null default false,
    create_ts timestamp not null default now(),
    last_message_ts timestamp
);

create table if not exists app_pub.participants (
    room_id bigint not null references app_pub.rooms (id),
    user_id bigint not null references app_pub.users (id),
    primary key (room_id, user_id)
);

create table if not exists app_pub.messages (
    id bigserial primary key,
    room_id bigint not null references app_pub.rooms (id),
    sender_id bigint not null references app_pub.users (id),
    text text not null,
    create_ts timestamp not null default now()
);

create view app_pub.v_rooms as
    select 
        a.*,
        b.user_id
    from 
        app_pub.rooms as a,
        app_pub.participants as b
    where
        a.id = b.room_id;

alter table app_priv.user_secrets add constraint user_secrets_email_unique unique (email);