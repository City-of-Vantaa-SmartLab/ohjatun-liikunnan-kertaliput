# Vantaa Exercise Reservations

## Architecture

This project is simple client-server application built with
* Frontend: React.js & MobX
* Backend: Node.js & Express.js
* Database: PostgreSQL

Requires Node.js v24.

It integrates to Grynos to get the information about current courses available in Vantaa.

## Running locally

With Docker: `docker-compose up`.

Backend runs at [http://localhost:5000/](port 5000).
Frontend with Vite proxy runs at [http://localhost:3000/](port 3000).

Without Docker:

1. `cd backend && npm run dev`
2. `cd frontend && npm run dev`

### Backend API

* List of all available [courses](http://localhost:5000/api/courses)
* List of all available [events](http://localhost:5000/api/events)
* List of all available [users](http://localhost:5000/api/users)

## Deployment

The application runs in `vantaa-pwa` AWS account's Elastic Beanstalk.
App environments can be updated using EB CLI tools:

Install the tools (for quick setup, follow the README in GitHub):

- [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
- [GitHub](https://github.com/aws/aws-elastic-beanstalk-cli-setup)
- Remember to add EB CLI to PATH (e.g. `export PATH="/home/username/.ebcli-virtual-env/executables:$PATH"`).

Configure the EB CLI:

- [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html)
- Note: this process only initializes the current directory/repository on your computer. The relevant files have been added to gitignore.

1. Go to project directory root (where this file is). Type: `eb init`.
2. Select `eu-central-1` as the location (unless something's been changed).
3. If you haven't set up your AWS credentials yet, provide your personal Access key ID and Secret access key. You got them when receiving the AWS credentials (you should have got the following: **User name,Password,Access key ID,Secret access key,Console login link**). On Linux/OS X, the credentials will be stored in `~/.aws/config`.
4. Select `Jumppaliput` as application. Don't continue with CodeCommit (defaults to N).
5. Ensure the environment is set up by typing `eb list`.

To deploy new version, run `eb deploy <environment name>`, e.g. `eb deploy jumppaliput-test`.
Note: only committed changes are be deployed with `eb deploy`.

## Documentation of APIs

See (API)[documentation/README.md]

## Updating prices

See the file backend/src/utils/courses.js
There are the following environment variables:

    POOL_WATER_PRICE_BEFORE_4
    POOL_WATER_PRICE_AFTER_4
    FLOOR_GYM_PRICE_BEFORE_4
    FLOOR_GYM_PRICE_AFTER_4
    DEFAULT_PRICE

Update the new price to AWS environment configuration.
