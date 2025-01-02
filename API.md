# Backend Design

## Schemas

### User Schema

{
userId: String,
username: String,
email: String,
role: String,
profile: ObjectId[Profile]
experience: Integer
currentRoomCode: String | null
}

### Profile Schema

{
userId: ObjectId[User]
solvedProblems: ObjectId[Problem]
attemptedProblems: ObjectId[Problem]
}

### Problem Schema

{
problemId: Integer,
name: String,
description: String (html to render),
difficultyTag: String,
publicTestCases: Arr[ObjectId[TestCase]]
privateTestCases: Arr[ObjectId[TestCase]]
}

### Testcase Schema

{
testcaseId: Integer,
problemId: ObjectId[Problem],
input: Object,
output: Object,
}

### Participant Object (In-Memory)

userId: {
socket: socket object/socketId,
score: Integer,
currentlyRunning: True,
}

### Rooms Object (In-Memory Mapping)

roomId: {  
participants: Arr[userIds],
code: String,
tags: Arr[String],
leader: userId
}

## API Design

no jwt: 401 unauthorized
invalid jwt: 403 forbidden

### Auth

GET /v1/auth/login -> should be a 301 redirect (provider)
POST /v1/auth/callback -> redirect back to website

### User

GET /v1/user/:userId -> 200 ok
POST /v1/user/ -> 201 created + user object
PATCH /v1/user/:userId -> 200 ok + new user object
DELETE /v1/user/:userId -> 204 (no object)

### Profile

GET /v1/profile/:userId -> 200 ok

### Problem

GET /v1/problem/:problemId -> 200 ok + problem object MINUS privateTestCases
POST /v1/problem/ -> 201 created + problem object
PATCH /v1/problem/:problemId -> 200 ok + new problem object

### Submission

POST /v1/submit/ -> 202 accepted (send to J0 immediately, and put on a queue.)

### Room

POST /v1/room/ -> 201 created + room object
GET /v1/room/:roomId -> 200 ok + room object
GET /v1/room/leaderboard/:roomId -> 200 ok + calculated leaderboard (userId: sessionPoints)
PATCH /v1/room/:roomId -> 200 ok + new room object

## Socket Interface

"user-join-room": (userId: UserId)
"user-leave-room": (userId: UserId)
"user-leave-room-graceful": (userId: UserId, leader: UserId)
"user-chat-message": (timestamp, sender: UserId, message: String)
"server-chat-message": (timestamp, message: String)
"server-submission-results": (userId: UserId, passed: Boolean, failingTestCase?: TestCase)
"server-submit-successful": (userId: UserId)
