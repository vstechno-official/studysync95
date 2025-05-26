# StudySync '95

A retro-themed study task manager for high school students, built with Express.js, Prisma, and a custom CSS framework.

## Overview

StudySync '95 is a web application designed to help high school students manage their studies effectively. It features:

*   Task management: Add, view, and mark tasks as complete.
*   In-app notifications: Reminders for upcoming deadlines.
*   Retro aesthetic: A unique user interface inspired by classic operating systems.

## Technologies Used

*   [Express.js](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
*   [Prisma](https://www.prisma.io/): A modern database toolkit for Node.js and TypeScript.
*   [Node.js](https://nodejs.org/): JavaScript runtime environment.
*   [Custom CSS Framework]: A unique retro-inspired design.

## Setup Instructions

Follow these steps to get StudySync '95 running on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/vstechno-official/studysync95.git
    cd studysync95
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Generate the Prisma client:**

    ```bash
    npx prisma generate
    ```

5.  **Start the server:**

    ```bash
    npm start
    ```

6.  **Open the application:**

    Open your web browser and navigate to `http://localhost:3000`.

## Environment Variables

The following environment variables are used:

*   `PORT`: The port the server listens on (default: `3000`).
*   `DATABASE_URL`: The URL for the SQLite database (default: `file:./dev.db`).

Create a `.env` file in the root directory of the project and add these variables:

PORT=3000
DATABASE_URL="file:./dev.db"


## Contributing

Contributions are welcome! If you'd like to contribute to StudySync '95, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.