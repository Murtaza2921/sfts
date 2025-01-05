#update primsa table
npx prisma migrate dev --create-only --name add-password-column

#update the data base

npx prisma migrate dev

#add prmissions 

CREATE USER 'your_user'@'DESKTOP-L99TSQC' IDENTIFIED WITH 'mysql_native_password' BY 'your_password';
GRANT ALL PRIVILEGES ON . TO 'your_user'@'DESKTOP-L99TSQC' WITH GRANT OPTION;
FLUSH PRIVILEGES;

#create prima 
npx prisma generat

