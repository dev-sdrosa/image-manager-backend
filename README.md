# Image Manager Backend
> A REST API for image file management with OAuth.

## Table of Contents
* [General Info](#general-information)
* [Most Relevant Technologies](#most-relevant-technologies)
* [Setup](#setup)
* [Room for Improvement](#room-for-improvement)
* [Contact](#contact)
<!-- * [License](#license) -->


## General Information
- Complete authentication: sign-up, sign-in, forgot password, email services for account verification
- Image management for AWS S3 uploads (And internal use)
- Unsplash API for search external images, upload process from Unsplash image to AWS S3 bucket


## Most Relevant Technologies
- Node - version 18.16.0
- NestJS - version 10.0.0
- Typescript - version 5.1.3
- TypeORM - version 0.3.17
- Nodemailer - version 6.9.3
- Passport-JWT - version 4.0.1
- AWS-sdk - version 2.1409.0
- Axios - vesion 1.4.0


## Setup
All packages require for this setup are inside `package.json`. Is important to know that the version of Node used is 18.16.0 (nvm install 18.16.0, may work as well).

- First run `npm install` to install required packages
- On the root directory, create a `.env` file, this file will hold all the required variables to run this project (You could use the .env.example as guide):
- To get credentials '`EMAIL_USER'` and '`EMAIL_PASSWORD'`, follow this [guide](https://miracleio.me/snippets/use-gmail-with-nodemailer/) to activate your gmail account with Nodemailer
- To get access to Unsplash API use `UNSPLASH_CLIEND_ID='6I-YLGLIp-KO2Kh83_y4lvN8CBd3O_Eiu81VEvd2PCs'`
- After that, run `npm run start:dev` to start the project.

## Room for Improvement

- S3 objectCopy returned permission errors, so it interrupted the operating logic of the file name update at the S3 bucket level. So the image update endpoint is inactive, this can be solved quickly since there is already a service for it.
- The structure of the responses can be better standardized, to have a better consistency in the formats.
- Jest unit tests.
- Dockerization of the project.
- Add excluded enviroment variables to ConfigService


## Contact
Created by [@sdrosa-dev]([https://www.flynerd.pl/](https://www.linkedin.com/in/sdrosa-dev/)).

