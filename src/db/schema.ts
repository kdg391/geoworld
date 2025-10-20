import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  doublePrecision,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

import { customJsonb } from './customJsonb.ts'

import type { GameSettings, Guess } from '../types/game.ts'
import type { RoundLocation } from '../types/location.ts'
import type { Avatar } from '../types/profile.ts'

export const gameModesEnum = pgEnum('game_modes', ['standard', 'streak'])
export const gameStatesEnum = pgEnum('game_states', ['started', 'finished'])
export const mapTypesEnum = pgEnum('map_types', ['community', 'official'])
export const userRolesEnum = pgEnum('user_roles', ['admin', 'user', 'guest'])

/*
create table geoworld.accounts (
  id uuid not null default extensions.uuid_generate_v4 (),
  provider text not null,
  account_id text not null,
  refresh_token text null,
  access_token text null,
  scope text null,
  id_token text null,
  user_id uuid not null,
  hashed_password text null,
  access_token_expires_at timestamp with time zone null,
  refresh_token_expires_at timestamp with time zone null,
  constraint accounts_pkey primary key (id),
  constraint provider_unique unique (provider, account_id),
  constraint accounts_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;
*/
export const accountsTable = pgTable(
  'accounts',
  {
    id: uuid().notNull().defaultRandom().primaryKey(),
    provider: text().notNull(),
    accountId: text('account_id').notNull(),
    accessToken: text('access_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      withTimezone: true,
    }),
    refreshToken: text('refresh_token'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      withTimezone: true,
    }),
    scope: text(),
    idToken: text('id_token'),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    hashedPassword: text('hashed_password'),
  },
  (table) => [unique().on(table.provider, table.accountId)],
)

/*
create table geoworld.challenges (
  id uuid not null default extensions.uuid_generate_v4 (),
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  user_id uuid not null,
  constraint challenges_pkey primary key (id),
  constraint challenges_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;
*/
export const challengesTable = pgTable('challenges', {
  id: uuid().notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
})

/*
create table geoworld.email_verification_codes (
  code text not null,
  expires_at timestamp with time zone not null,
  id text not null,
  email text not null,
  user_id uuid not null,
  created_at timestamp with time zone not null,
  constraint email_verification_tokens_pkey primary key (id),
  constraint email_verification_codes_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;
*/
export const emailVerificationCodesTable = pgTable('email_verification_codes', {
  id: text().notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  email: text().notNull(),
  code: text().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

/*
create table geoworld.games (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null,
  map_id uuid not null,
  rounds jsonb not null default '[]'::jsonb,
  guesses jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  round smallint not null,
  state geoworld.game_state not null,
  mode geoworld.game_mode not null,
  total_score integer not null default 0,
  total_time real not null default '0'::real,
  constraint games_pkey primary key (id),
  constraint games_map_id_fkey foreign KEY (map_id) references geoworld.maps (id) on delete CASCADE,
  constraint games_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger delete_map_average_score_trigger
after DELETE on geoworld.games for EACH row when (old.state = 'finished'::geoworld.game_state)
execute FUNCTION geoworld.update_map_average_score_on_delete ();

create trigger update_map_average_score_trigger
after
update OF state on geoworld.games for EACH row when (
  new.state = 'finished'::geoworld.game_state
  and old.state = 'started'::geoworld.game_state
  and ((old.settings ->> 'rounds'::text)::integer) = 5
  and ((old.settings ->> 'canPan'::text)::boolean) = true
  and ((old.settings ->> 'canZoom'::text)::boolean) = true
  and ((old.settings ->> 'canMove'::text)::boolean) = true
  and ((old.settings ->> 'timeLimit'::text)::integer) = 0
)
execute FUNCTION geoworld.update_map_average_score_on_update ();

create trigger update_map_explorers_trigger
after DELETE
or
update on geoworld.games for EACH row
execute FUNCTION geoworld.update_map_explorers ();
*/
export const gamesTable = pgTable('games', {
  id: uuid().notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  mapId: uuid('map_id')
    .notNull()
    .references(() => mapsTable.id, { onDelete: 'cascade' }),
  rounds: customJsonb<RoundLocation[]>('rounds').notNull().default([]),
  guesses: customJsonb<Guess[]>('guesses').notNull().default([]),
  // eslint-disable-next-line
  // @ts-ignore
  settings: customJsonb<GameSettings>('settings').notNull().default({}),
  round: smallint().notNull(),
  state: gameStatesEnum().notNull(),
  mode: gameModesEnum().notNull(),
  totalScore: integer('total_score').notNull().default(0),
  totalTime: real('total_time').notNull().default(0),
})

/*
create table geoworld.likes (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null,
  map_id uuid not null,
  constraint likes_pkey primary key (id),
  constraint likes_map_id_fkey foreign KEY (map_id) references geoworld.maps (id) on delete CASCADE,
  constraint likes_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_map_likes_count_trigger
after INSERT
or DELETE on geoworld.likes for EACH row
execute FUNCTION geoworld.update_map_likes_count ();
*/
export const likesTable = pgTable('likes', {
  id: uuid().notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  mapId: uuid('map_id')
    .notNull()
    .references(() => mapsTable.id, { onDelete: 'cascade' }),
})

/*
create table geoworld.locations (
  created_at timestamp with time zone not null default now(),
  map_id uuid not null,
  heading double precision not null,
  pitch double precision not null,
  lat numeric not null,
  lng numeric not null,
  pano_id text not null,
  zoom double precision not null,
  user_id uuid not null,
  streak_location_code text null,
  id uuid not null default gen_random_uuid (),
  constraint locations_pkey primary key (id),
  constraint locations_map_id_fkey foreign KEY (map_id) references geoworld.maps (id) on delete CASCADE,
  constraint locations_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_world_map_after_delete
after DELETE on geoworld.locations for EACH row
execute FUNCTION geoworld.update_world_map_locations_count ();

create trigger update_world_map_after_insert
after INSERT on geoworld.locations for EACH row
execute FUNCTION geoworld.update_world_map_locations_count ();
*/
export const locationsTable = pgTable('locations', {
  id: uuid().notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  heading: doublePrecision().notNull(),
  pitch: doublePrecision().notNull(),
  zoom: doublePrecision().notNull(),
  lat: numeric({ mode: 'number' }).notNull(),
  lng: numeric({ mode: 'number' }).notNull(),
  panoId: text('pano_id').notNull(),
  streakLocationCode: text('streak_location_code'),
  mapId: uuid('map_id')
    .notNull()
    .references(() => mapsTable.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
})

export const locationsRelations = relations(locationsTable, ({ one }) => ({
  map: one(mapsTable, {
    fields: [locationsTable.mapId],
    references: [mapsTable.id],
  }),
}))

/*
create table geoworld.magic_link_tokens (
  id text not null,
  created_at timestamp with time zone not null,
  expires_at timestamp with time zone not null,
  token text not null,
  email text not null,
  constraint magic_link_tokens_pkey primary key (id)
) TABLESPACE pg_default;
*/
export const magicLinkTokensTable = pgTable('magic_link_tokens', {
  id: text().notNull().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text().notNull(),
  email: text().notNull(),
})

/*
create table geoworld.maps (
  created_at timestamp with time zone not null default now(),
  name text not null,
  description text null,
  creator uuid not null,
  type geoworld.map_type not null,
  id uuid not null default gen_random_uuid (),
  bounds jsonb null,
  updated_at timestamp with time zone not null default now(),
  score_factor double precision not null default '0'::double precision,
  locations_count integer not null default 0,
  is_published boolean not null,
  average_score integer not null default 0,
  explorers_count integer not null default 0,
  likes_count integer not null default 0,
  country_code text null,
  constraint maps_pkey primary key (id),
  constraint maps_creator_fkey foreign KEY (creator) references geoworld.users (id) on delete CASCADE,
  constraint maps_description_check check ((length(description) <= 500)),
  constraint maps_name_check check ((length(name) <= 20))
) TABLESPACE pg_default;
*/
export const mapsTable = pgTable(
  'maps',
  {
    id: uuid().notNull().defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    type: mapTypesEnum().notNull(),
    isPublished: boolean('is_published').notNull(),
    name: text().notNull(),
    description: text(),
    creator: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    bounds: jsonb().$type<{
      min: google.maps.LatLngLiteral
      max: google.maps.LatLngLiteral
    }>(),
    scoreFactor: doublePrecision('score_factor').notNull().default(0),
    averageScore: integer('average_score').notNull().default(0),
    explorersCount: integer('explorers_count').notNull().default(0),
    likesCount: integer('likes_count').notNull().default(0),
    locationsCount: integer('locations_count').notNull().default(0),
    countryCode: text('country_code'),
  },
  (table) => [
    check('name', sql`length(${table.name}) <= 20`),
    check('description', sql`length(${table.description}) <= 500`),
  ],
)

/*
create table geoworld.password_reset_tokens (
  id text not null,
  created_at timestamp with time zone not null,
  expires_at timestamp with time zone not null,
  email text not null,
  token text not null,
  user_id uuid not null,
  constraint password_reset_tokens_pkey1 primary key (id),
  constraint password_reset_tokens_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;
*/
export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  id: text().notNull().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  email: text().notNull(),
  token: text().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
})

/*
create table geoworld.profiles (
  id uuid not null,
  username text null,
  display_name text null,
  is_public boolean not null default true,
  avatar jsonb null,
  bio text null,
  updated_at timestamp with time zone null,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references geoworld.users (id) on delete CASCADE,
  constraint profiles_display_name_check check ((length(display_name) <= 20)),
  constraint profiles_username_check check ((length(username) <= 20))
) TABLESPACE pg_default;
*/
export const profilesTable = pgTable(
  'profiles',
  {
    id: uuid()
      .notNull()
      .primaryKey()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    username: text().unique(),
    displayName: text('display_name'),
    isPublic: boolean('is_public').notNull().default(false),
    avatar: jsonb().$type<Avatar>(),
    bio: text(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (table) => [
    check('display_name', sql`length(${table.displayName}) <= 20`),
    check('username', sql`length(${table.username}) <= 20`),
  ],
)

/*
create table geoworld.sessions (
  id text not null,
  expires_at timestamp with time zone not null,
  user_id uuid null,
  created_at timestamp with time zone not null default now(),
  user_agent text null,
  ip_address text null,
  constraint sessions_pkey primary key (id),
  constraint sessions_user_id_fkey foreign KEY (user_id) references geoworld.users (id) on delete CASCADE
) TABLESPACE pg_default;
*/
export const sessionsTable = pgTable('sessions', {
  id: text().notNull().primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
})

/*
create table geoworld.users (
  id uuid not null default extensions.uuid_generate_v4 (),
  email text not null,
  email_verified_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  role geoworld.user_role not null default 'user'::geoworld.user_role,
  email_verified boolean not null default false,
  constraint users_pkey primary key (id),
  constraint email_unique unique (email)
) TABLESPACE pg_default;
*/
export const usersTable = pgTable('users', {
  id: uuid().notNull().defaultRandom().primaryKey(),
  email: text().unique().notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', {
    withTimezone: true,
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  role: userRolesEnum().notNull().default('user'),
})
