
# Personal Blog PlatForm

A blog website built using NextJs 14 at Frontend and NodeJs,ExpressJs at Backend with MongoDB as Database.



## Features

- Server-side rendering for the homepage.
- Option to Edit and Delete Blogs (CRUD functionality)
- Client-side routing and protected routes.
- JWT Authentication for Backend API


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


In Frontend change the .env.example

`NEXT_PUBLIC_BACKEND_URL`

In backend Change the config/config.env

`ANOTHER_API_KEY`
`PORT`
`MONGO_URI`
`JWT_SECRET`
`ENCRYPTION_KEY`
## Installation

This repo contains both the frontend and Backend code.

* Run the following commands
```bash
  git clone https://github.com/aayush-1412/ac.git
  cd frontend
  npm install
  npm run dev
```
* Open another terminal to simultaneously run your backend
 ```bash
  cd backend
  npm install
  npm run dev
```
* Project runs on ``` http://localhost:3000 ``` by default
    
