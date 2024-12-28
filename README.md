# Binarysearch.io

Binarysearch was a website to practice data structures and algorithms similar to leetcode. The
main value proposition was its competitive aspect - users could create private rooms with their
friends and race to complete problems, with features such as a global experience bar per user
and a leveling system.

## Goals
The idea is to create a clone of binarysearch that brings back the competitive/multiplayer
aspect.

- Full stack dockerized website powered by Judge0
- Automatic Testing library to generate testcases for problems of varying input types and constraints
- A large repository of problems


## System Architecture

See the [API description](./API.md)

### Frontend
- NextJS
- ChakraUI


### Backend/Server
- Database: MongoDB (Mongoose)
- Server Deployment: AWS S3/ECS

#### Services

#### External Libraries
- Auth: NextAuth 
- Code Execution: Judge0
- Websocket server: Socket.io
- Test Framework: TBD
