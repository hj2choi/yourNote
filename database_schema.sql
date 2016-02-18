DROP TABLE if exists channel cascade;

CREATE TABLE note (
  id serial primary key,
  channel text,
  field text
);
