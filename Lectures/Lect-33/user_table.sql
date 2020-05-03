
DROP TABLE if exists "user";

CREATE TABLE "user" (
	"id"        	uuid DEFAULT uuid_generate_v4() not null primary key,
	"username"  	text,
	"real_name" 	text,
	"password_enc"	text,
	"password_enc"	text

);

COMMENT ON COLUMN "user"."id" IS 'Unique generated ID for this tables row';
COMMENT ON COLUMN "user"."username" IS 'the name of the user (usually an email address)';
COMMENT ON COLUMN "user"."real_name" IS 'persons name';
COMMENT ON COLUMN "user"."password_enc" IS 'encrypted password for user';

CREATE UNIQUE INDEX "user_1_uk" on "user" ( "username" );
CREATE INDEX "user_1" on "user" ( "real_name" );

