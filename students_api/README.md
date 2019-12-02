
```
$ npm install
$ sls offline start
```

/config/env.json------"Any": "postgres://username:password@IP_address:port_number/database_name"
/config/env.json------"POSTGRES": "postgres://postgres:1derful@localhost:5433/my_db"



# Postgres SQL local
CREATE TABLE stud (
  id bigserial NOT NULL,
  stu_id varchar(50) UNIQUE NOT NULL,
  name varchar(50) NOT NULL,
	age varchar(50) NOT NULL,
	roll_no varchar(50) NOT NULL,
	address varchar(50) NOT NULL,
	class_id integer,
  created_by integer,
  PRIMARY KEY (id),
  FOREIGN KEY (class_id) REFERENCES class(id)
);

create table class(
 id bigserial NOT NULL,
 class_id varchar(50) UNIQUE NOT NULL,
 class_name varchar(50) 
)

create table session_table(
  use_id integer,
  email varchar(200),
  password varchar(200)
)
create table users(
user_id intger ,
email varchar(200),
password varchar(200),
status integer
)


```
