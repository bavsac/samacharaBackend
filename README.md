## About the app

**_Samachara_** is an API to access application data programmatically.
_It mimicks the building of a real world backend service (such as reddit)_.
It is designed to provide information to the front end architecture requests for.
The database used is PostgreSQL.

### **Installation**

Run the following command to install all the dependencies
`npm install`

### **Running test with the test database**

Run the coomand to test this code
`npm test`

### **Dependencies**

- cors
- dotenv
- express
- nodemon
- jsonwebtoken
- pg
- pg-format
- valid-url

### **Versions**

- developed on VS Code 1.56.2
- tested using supertests 6.1.3 ,Jest 26.6.3 and Jest-sorted 1.0.12

### **Maintainence** - _things to validate and update as the app progresses_

- implementation of pagination
- implementation of JWTokens

### **Constraints**

- username has to be in string format. The username has to be unique and cannot have any special characters with the exception of \_(!@£$%^&\*()-+=€#⁄™‹›‡°±;:…'¯˘¿...)

- name has to be in the format of <string>, any alphabet in the english language(case insisitive)
