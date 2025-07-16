# favorite-products-api

### stack

- **NestJS** (Node.js + TypeScript) — core API framework
- **TypeORM** — ORM for relational database integration
- **PostgreSQL** — relational database
- **class-validator** — data validation (DTOs)
- **bcryptjs** — secure password hashing
- **Passport + @nestjs/passport + @nestjs/jwt** — JWT authentication
- **Helmet** — HTTP header security
- **CORS** — cross-origin protection
- **CSRF** — CSRF protection
- **pino** — structured logging
- **Docker/Docker Compose** (optional, for database)
- **Postman** (API testing suite)

```
# docker compose database commands

run database
$ docker compose up -d 

stop database
$ docker compose down 

view database logs
$ docker compose logs -f 
```

```
# to run application

node version v22.16.0

$ cp .env.example .env
$ npm i
$ npm run start:dev
```

TIP: [postman collection](./favorite-products-api.postman_collection.json)

### how to use api - step by step 
`some endpoints - full list in the collection`

1. register a user
```
POST /auth/register
Content-Type: application/json

{
  "username": "new_user",
  "password": "Password123"
}
```

2. log in
```
POST /auth/login
Content-Type: application/json

{
  "username": "new_user",
  "password": "Password123"
}
```

3. create a client
```
POST /clients
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

4. browse products from fakestore
```
GET /external-products?page=1&limit=10
```

5. add a product to favorites
```
POST /clients/:id/favorites
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "productId": 5
}
```

6. list a client's favorite products
```
GET /clients/:id/favorites?page=1&limit=10&sort=price&order=asc
Authorization: Bearer <access_token>
```