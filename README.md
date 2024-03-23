# NODE.JS CLEAN ARCHITECTURE SAMPLE API

This project is presented for an article I wrote on <strong>Medium</strong>, providing a tutorial about a simplified example of clean architectre using Node.js, Express, Mongodb, Redis.<br/>

- [Full article on Medium](https://medium.com/@tareksaimouah/node-js-clean-architecture-simplified-example-b9f9b4d65ba5)

Node.js REST API clean architecture sample project documentation.

## Tech Stack

- Node js (16^).
- Express.js (4^)
- mongodb (5^)

## Main Features

- Authentication
- Authorization
- Protected routes
- Role-based access control (RBAC)
- Database seed
- Cache db

## How to use

- clone project
- create .env file in the root directory and fill this environment variables:
  - PORT
  - MONGODB_URL
  - JWT_SECRET
  - AUTHORIZATION_KEY
  - SEED_ADMIN_USERNAME
  - SEED_ADMIN_PASSWORD
  - CACHE_DB_HOST (Optional for cache db)
  - CACHE_DB_PORT (Optional for cache db)
  - CACHE_DB_PASSWORD (Optional for cache db)
- run:

```bash
$ npm install
$ npm run db:seed
$ npm run dev
```

## Contents

- [Global Responses](#global-responses)

- [Auth Routes](#auth-routes)

  - [Signup user](#signup-user)
  - [Login user](#login-user)
  - [Login manager](#login-manager)
  - [Forgot password](#forgot-password)

- [Manager Routes](#manager-routes)

  - [Create new manager](#create-new-manager)
  - [Get all managers](#get-all-managers)
  - [Get manager](#get-manager)
  - [Delete manager by id](#delete-manager-by-id)
  - [Update manager](#update-manager)

- [User Routes](#user-routes)

  - [Get all users](#get-all-users)
  - [Get user](#get-user)
  - [Delete user by id](#delete-user-by-id)
  - [Update user by admin](#update-user-by-admin)
  - [Update user profile](#update-user-profile)
  - [Verify account](#verify-account)
  - [Resend Otp Code](#resend-otp-code)
  - [Reset password](#reset-password)
  - [Delete account](#delete-account)

- [Models](#models)

  - [Manager](#manager)
  - [User](#user)

---

## Global Responses

- **Headers**

  > `'Authorization-Key': string`

  > `'admin-access-token': "Bearer ${jwtToken}"` _(For admin routes)_

  > `'x-access-token': "Bearer ${jwtToken}"` _(For user routes)_

- **Responses**

  - **Unauothorized Client**

    Status: **`401`**

    ```
       {
        "success": false,
        "message": string
      }
    ```

  - **Forbidden**

    Status: **`403`**

    ```
      {
        "success": false,
        "message": string
      }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Not Acceptable**

    Status: **`406`**

    ```
    {
      "success": false,
      "error": string
    }
    ```

  - **Internal Server Error**

    Status: **`500`**

    ```
    {
      "success": false,
      "message": string

    }
    ```

---

## Auth Routes

#### Signup User

- **Request**

  **`POST`** `/auth/user/sign-up`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  firstName: string, *required.
  lastName: string, *required.
  email: string, pattern(email), *required.
  password: string, min(8), *required.
  confirmPassword: string, *required.
  phoneNumber: string, pattern(numbers), *required.
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "user": User
    }
    ```

  - **Conflict**

    Status: **`409`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Login User

- **Request**

  **`POST`** `/auth/user/sign-in`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  phoneNumber: string, *required.
  password: string, *required.
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string,
      "token": string,
      "user": User
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Bad Request**

    Status: **`400`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Login Manager

- **Request**

  **`POST`** `/auth/manager/sign-in`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  username: string, *required.
  password: string, *required.
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string,
      "token": string,
      "manager": Manager
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string,
    }
    ```

  - [Manager Model](#manager)

#### Forgot Password

- **Request**

  **`PATCH`** `/auth/forgot-password`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  phoneNumber: string, *required.
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string,
      "userId": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

---

## Manager Routes

#### Create New Manager

- **Request**

  **`POST`** `/manager`

- **Body**

  ```
  username: string, pattern(email), *required.
  password: string, min(8), *required.
  confirmPassword: string, *required.
  role: string, valid('Manager', 'Director', 'Monitor'), *required.
  phoneNumber: string, pattern(numbers), *required.
  ```

- **Role**

  **`Manager`**

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "manager": Manager
    }
    ```

  - **Conflict**

    Status: **`409`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - [Manager Model](#manager)

#### Get All Managers

- **Request**

  **`GET`** `/manager`

  - **Role**

  **`Director`**

- **Query**

  ```
  username: string.
  role: string, valid('Manager', 'Director', 'Monitor').
  phoneNumber: string, pattern(numbers)
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "totalResults": Int,
      "results": [Manager]
    }
    ```

  - [Manager Model](#manager)

#### Get Manager

- **Request**

  **`GET`** `/manager/{id}`

- **Role**

  **`Director`**

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "manager": Manager
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - [Manager Model](#manager)

#### Delete Manager By Id

- **Request**

  **`DELETE`** `/manager/{id}`

- **Role**

  **`Manager`**

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

#### Update Manager

- **Request**

  **`PATCH`** `/manager/{id}`

- **Role**

  **`Manager`**

- **Body**

  ```
  username: string.
  role: string, valid('Manager', 'Director', 'Monitor').
  phoneNumber: string, pattern(numbers).
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "manager": Manager
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Conflict**

    Status: **`409`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

  - [Manager Model](#manager)

---

## User Routes

#### Get All Users

- **Request**

  **`GET`** `/user`

- **Query**

  ```
  firstName: string.
  lastName: string.
  email: string, pattern(email).
  phoneNumber: string, pattern(numbers)
  page: Int, min(1).
  size: Int, min(1).
  ```

- **Role**

  **`Director`**

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "page": Int,
      "totalPages": Int,
      "pageResults": Int,
      "totalResults": Int,
      "results": [User]
    }
    ```

  - [User Model](#user)

#### Get User

- **Request**

  **`GET`** `/user/{id}`

- **Role**

  **`Director`**

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "user": User
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Delete User By Id

- **Request**

  **`DELETE`** `/user/{id}`

- **Role**

  **`Manager`**

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

#### Update User By Admin

- **Request**

  **`PATCH`** `/user/{id}`

- **Role**

  **`Director`**

- **Body**

  ```
  firstName: string.
  lastName: string.
  email: string, pattern(email).
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "user": User
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Conflict**

    Status: **`409`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Update User Profile

- **Request**

  **`PATCH`** `/user/{id}/profile`

- **Role**

  **`Director`**

- **Body**

  ```
  firstName: string.
  lastName: string.
  email: string, pattern(email).
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "user": User
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Conflict**

    Status: **`409`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

  - **Bad Request**

    Status: **`400`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Verify Account

- **Request**

  **`PATCH`** `/user/{id}/verify-account`

- **Body**

  ```
  code: string.
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string,
      "token": string,
      "user": User
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Bad Request**

    Status: **`400`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

  - [User Model](#user)

#### Resend Otp Code

- **Request**

  **`PATCH`** `/user/resend-code`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  userId: string, *required.
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

#### Reset Password

- **Request**

  **`PATCH`** `/user/{id}/reset-password`

  > **note:** `access-token header is not required.`

- **Body**

  ```
  code: string, *required.
  password: string, min(8), *required.
  confirmPassword: string, *required.
  ```

- **Responses**

  - **Created**

    Status: **`201`**

    ```
    {
      "success": true,
      "message": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

  - **Bad Request**

    Status: **`400`**

    ```
     {
      "success": false,
      "message": string
    }
    ```

#### Delete Account

- **Request**

  **`DELETE`** `/user/account`

- **Body**

  ```
  phoneNumber: string, *required.
  password: string, *required.
  ```

- **Responses**

  - **Success**

    Status: **`200`**

    ```
    {
      "success": true,
      "message": string
    }
    ```

  - **Not Found**

    Status: **`404`**

    ```
    {
      "success": false,
      "message": string
    }
    ```

---

## Models

#### Manager

```
{
  id: string,
  username: string,
  role: string,
  phoneNumber: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### User

```
{
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  verified: Boolean,
  otpCode?: string,
  otpExpire?: Date,
  createdAt: Date,
  updatedAt: Date
}
```
