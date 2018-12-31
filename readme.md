# KHealth Chatbot Exercise
Chatbot exercise: web server and CLI app.

## Web Server
### Installing
run `npm install`

### Start app
run `npm start`

running on default port: `5000`

### API
**Welcome to K-Health chatbot:**

GET `http://localhost:5000/start`

---
**Create new user:**

**Req:** 
POST `http://localhost:5000/start/new-user/{username}`

**Res:** Success msg or Error msg

Adding new user to cache and defaulting data.

---
**Restart user quest:**

**Req:** 
POST `http://localhost:5000/start/{username}`

**Res:** Success msg or Error msg

Restart existing user data to start quest from beginning.

---
**Get next question:**

**Req:** 
 GET `http://localhost:5000/next-question/{username}`

**Res:** Question and what are the optional answers in bracket or free text.

Return relevant question that the user need to answer and optional answers in bracket or free text. 

---
**Answer question:**

**Req:** POST `http://localhost:5000/answer-question/{username}`

**Res:** Next question / finish quest / error msg because of wrong input.

Getting answer, checking if it correct. If answer correct calling to next question, else returning error msg. 
In case that the user finish his quest - will return 'Thank you for answering'. 
For each question there will be three options to answer:
1. Free text.
2. Optional answers in brackets - you need to pick one.
3. Multi - Optional answers in brackets - you can pick from one to all, with ',' between.

---

## CLI app
run `node CLI-app.js`

The first question will appear after running the app.
For each question there will be three options to answer:
1. Free text.
2. Optional answers in brackets - you need to pick one.
3. Multi - Optional answers in brackets - you can pick from one to all, with ',' between.

In the end of the quest you'll get 'Thank you for answering'.
After it you can start over or exit.
