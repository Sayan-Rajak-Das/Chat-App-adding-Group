

# Chat App

This is a simple chat application where users can log in, register, and chat in real-time. Users can also join rooms and chat with others.

## Project Screenshots

![Screenshot 1](./screenshots/img1.png)  
![Screenshot 2](./screenshots/img2.png)  
![Screenshot 3](./screenshots/img3.png)  
![Screenshot 4](./screenshots/img4.png)  
![Screenshot 5](./screenshots/img5.png)

## Project Screenshots

You can try out the app live on the following link:  
[Chat App - Live Demo](https://chat-app-adding-group.onrender.com/)


## Steps to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/Sayan-Rajak-Das/Chat-App-adding-Group
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Seed the database with initial data:
   A seed file is included to populate the database. You can run it with the following command:
   ```bash
   node backend/src/seeds/user.seed.js
   ```
   This will insert sample user data into the database.

## How to Use

- Log in or register using any user credentials.
- Once logged in, you can experience real-time chat with other users.
- You can also join chat rooms to participate in group discussions.

## Features

- **Real-time messaging** using Socket.IO.
- **Bootstrap** is used for the frontend styling.

