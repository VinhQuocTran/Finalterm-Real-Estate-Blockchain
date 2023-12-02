CREATE TABLE account (
  id            int IDENTITY NOT NULL, 
  cash_balance  decimal(10, 2) NOT NULL, 
  token_balance decimal(10, 2) NOT NULL, 
  username      varchar(128) NOT NULL, 
  password      varchar(128) NOT NULL, 
  role          varchar(56) NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE property (
  id           int IDENTITY NOT NULL, 
  created_date date NOT NULL, 
  room_number  int NOT NULL, 
  area         int NOT NULL, 
  address      varchar(256) NOT NULL, 
  account_id   int NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE submit_listing_property (
  id             int IDENTITY NOT NULL, 
  submitted_date date NOT NULL, 
  result         bit NULL, 
  result_date    date NULL, 
  property_id    int NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE listing_property (
  id                         int IDENTITY NOT NULL, 
  monthly_rent               int NOT NULL, 
  listed_date                date NOT NULL, 
  property_valuation         int NOT NULL, 
  property_manager_id        int NOT NULL, 
  submit_listing_property_id int NOT NULL, 
  PRIMARY KEY (id));
CREATE TABLE property_manager (
  id            int IDENTITY NOT NULL, 
  fee_per_month int NOT NULL, 
  name          varchar(128) NOT NULL, 
  PRIMARY KEY (id));
ALTER TABLE property ADD CONSTRAINT FKproperty178803 FOREIGN KEY (account_id) REFERENCES account (id);
ALTER TABLE submit_listing_property ADD CONSTRAINT FKsubmit_lis624585 FOREIGN KEY (property_id) REFERENCES property (id);
ALTER TABLE listing_property ADD CONSTRAINT FKlisting_pr267677 FOREIGN KEY (submit_listing_property_id) REFERENCES submit_listing_property (id);
ALTER TABLE listing_property ADD CONSTRAINT FKlisting_pr909109 FOREIGN KEY (property_manager_id) REFERENCES property_manager (id);
