### Table: user

| Column Name  | Column Type | Index | Description                                     |
|--------------|-------------|-------|-------------------------------------------------|
| id           | uuid        | PK    | Unique generated ID for this tables row         |
| username     | text        | UK    | the name of the user (usually an email address) |
| real_name    | text        | P     | persons name                                    |
| password_enc | text        |       | encrypted password for user                     |

