# bothniabladet-api

Need your own ENV file. As well as a created db.

You also need to create your own database with the name "bothniabladet" in mysql, as TypeORM doesn't have the privileges to do so. 

# Example .env file:  
DB_PD = [Database password]   
PORT=8080  
WHITELISTED_DOMAINS= http://localhost:3000,http://localhost:3001  
JWT_SECRET = [secret string]  
