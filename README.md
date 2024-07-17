# Playboxd Backend Documentation

Welcome to the Playboxd backend documentation. This document provides an overview of the API endpoints, authentication mechanisms,  environment variables, and instructions on how to set up and run the project.

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [WebSocket](#websocket)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Introduction

This is a portfolio project to showcase what I learned as a fullstack developer, is part of a larger application that includes a frontend built with Next.js. Inspired by letterboxd

## Getting Started

### Prerequisites
- Node.js (version 18.0 or later)
- MongoDB Community version (version 7.0 or later)
- Yarn or npm

### Installation
0. Fork the repo

1. Install dependencies:
    ```sh
    yarn install or npm install
   
    ```

3. Create a `.env` file in the root directory and configure your environment variables as described in the [Environment Variables](#environment-variables) section.

4. Start the development server:
    ```
    yarn start or  npm run start
    ```

5. Open your browser and navigate to `http://localhost:3000/api` to access the Swagger API documentation.

## Environment Variables

The following environment variables need to be configured in your `.env` file:

```plaintext
NODE_ENV=development
DATABASE_URI=mongodb://localhost:27017/Games
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=any encryption
RAWG_API_KEY= can be obtained at https://rawg.io/apidocs
AWS_ACCESS_KEY_ID=aws-access-key
AWS_SECRET_ACCESS_KEY=aws-secret
AWS_REGION=us-east-2
S3_BUCKET_NAME=your bucket
FRONTEND=http://localhost:3001
````
### 4. **API Documentation**

NestJS with Swagger makes it easy to document your API. Swagger can be accessed at `http://localhost:3000/api`.

Currently there only user auth and game interactions modules are properly documented


### 5. **Running Tests**

```markdown
The project includes at the moment only unit tests.

To run the unit tests: yarn test or npm run test
```
### 6. **Deployment**

This project was deployed at aws ec2, there are a couple of secrets that you will need for more information go to appleboy-ssh

- **Appleboy SSH Action:** [appleboy/ssh-action](https://github.com/appleboy/ssh-action)

### 7. **Contact**

Hit me at:

- **Email:** [paroniyan@gmail.com](mailto:your.email@example.com)
- **GitHub Repository:** [Playboxd Front](https://github.com/YanParoni/design-template)
- **LinkedIn:** [Yan](https://www.linkedin.com/in/yan-paroni/)
