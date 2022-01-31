# Node js Backend with Express js

## _E-commerce project_

## Features

- Used MongoDB for database
- JWT for token
- used some middleware for errors and file upload
- ESLint, nodemon package for development
- Pagination and validation

## Installation

App requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd project
npm i
npm run start
```

For production environments...

```sh
npm run dev
```

#

## How to use

### For access to apis use this pattern:

Get All Producs:

```sh
http://localhost:3000/api/v1/products
```

Get All Product with some specific fileds:

```sh
http://localhost:3000/api/v1/products?fields=name,price
```

Get All Product with page and limitation:

```sh
http://localhost:3000/api/v1/products?page=2&limit=2
```

\*Note: You need to have a token for some APIs use signup if you don't have a token and login if you have a token

### Signup

```sh
http://localhost:3000/api/v1/auth/signup

{
    "name":"mike",
    "email":"mike@gmail.de",
    "password":"123456",
    "phone":123456789,
    "city":"Berlin",
    "country":"Germany",
    "postCode":123654,
    "address":"Dodeldorf Str No 147"
}
```

### Login

```sh
http://localhost:3000/api/v1/auth/login

{
    "email":"mike@gmail.de",
    "password":"123456"
}
```
