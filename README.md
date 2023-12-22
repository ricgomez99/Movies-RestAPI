# Movies API:
## Overview
+ This RESTful API is designed to manage movie data efficiently. It leverages Node.js and Express to provide a robust server, ensuring smooth interactions with the database.
## Technologies Used
+ **Node.js & Express.js:** Powering the server to handle HTTP requests and responses efficiently.
+ **Zod:** Employed for input validations, ensuring data integrity and security.
+ **SQL & MySQL:** The project utilizes SQL queries with MySQL as the database, fostering efficient data storage and retrieval.
## Architectural Design
+ The project adopts the MVC (Model, View, Component) architecture for a clean and organized codebase. This separation enhances code maintainability and scalability. Dependency Injection is implemented to further enhance the project's structure and facilitate future expansions.
## Testing
+ Uni tests are being actively applied to fortify the codebase, ensuring its resilience. These tests not only guarantee the functionality of the code but also serve as valuable documentation for developers seeking to understand key components.
## Getting Started
+ The database for this project has already been deployed to Planetscale, ensuring seamless data access. To use the API locally, follow these steps:
  1. **Clone the Repository:**
  ```js
  git clone [repository_url]
  ```
  2. **Install Dependencies:**
  ```js
  npm install
  ```
  3. **Run the Application Locally:**
  ```js
  npm run start:mysql
  ```
+ The application will run locally, allowing you to interact with the API through tools like Thunder client, Postman, or any preferred API testing tool.
+ Please note that the API is currently optimized for local testing. In the future, I plan to deploy the API to a server, making it accessible for browser usage or data fetching in separate projects. Stay tuned for updates on deployment status and additional features!
  
