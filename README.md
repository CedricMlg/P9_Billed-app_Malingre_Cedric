# P9_Billed-app_Malingre_Cedric

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

Clone the repo
   ```sh
   git clone https://github.com/CedricMlg/P9_Billed-app_Malingre_Cedric
   ```
   
# Billapp backend

## How to run the API locally

1. Go to the project directory
    ```sh
    cd Billed-app-FR-Back
    ```

2. Install project dependancies
    ```sh
    npm install
    ```

3. Run the API
    ```sh
    npm run:dev
    ```

### Access to the API

The API is locally available on port `5678`, go to `http://localhost:5678`

### administration : 
    ```sh
    utilisateur : admin@company.tld 
    mot de passe : admin
    ```
### employé :
    ```sh
    utilisateur : employee@company.tld
    mot de passe : employee
    ```
    
# Billapp frontend

## Project architecture
This project, known as the frontend, is connected to a backend API service that you must also start locally.

## How to run the APP locally

1. Go to the project directory
    ```sh
    cd Billed-app-FR-Front
    ```

2. Install packages
    ```sh
    npm install
    ```

3. Install live-server to run a local server
    ```sh
    npm install -g live-server
    ```

4. Run the app
    ```sh
    live-server
    ```

Go to : `http://127.0.0.1:8080/`


## How to run all tests locally with Jest ?

    ```sh
    npm run test
    ```

## How to see the test coverage ?

`http://127.0.0.1:8080/coverage/lcov-report/` when live-server is on.

## Users accounts :

You can log in using the following accounts:

### administration : 
```sh
votre email : admin@test.tld 
mot de passe : admin
```
### employé :
```sh
votre email : employee@test.tld
mot de passe : employee
```
