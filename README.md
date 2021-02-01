# Vantaa Exercise Reservations

## Architecture

This project is simple client-server application built with

*   Frontend: React.js & MobX
*   Backend: Node.js & Express.js
*   Database: PostgreSQL

It integrates to Grynos to get the information about current courses available in Vantaa.

## Running locally

The local development is set up using docker. Docker is a containerization that help shipping application easy, and without the hassle of installing many many things. We highly recommend you install docker.

### With Docker

Run

```
. ./run-locally.sh
```

This local development includes hot reloading on the front-end and the back-end.

## Deployment

### Development

To deploy, Heroku CLI needs to be set-up along with Docker.

```
. ./deploy-to-dev.sh
```

### Production

The production runs in Vantaa AWS Elastic Beanstalk in Ireland (EU-West-1).

To update production using EB CLI tools:

Install the tools (for quick setup, follow the README in GitHub):
* [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
* [GitHub](https://github.com/aws/aws-elastic-beanstalk-cli-setup)
* Remember to add EB CLI to PATH (e.g. `export PATH="/home/username/.ebcli-virtual-env/executables:$PATH"`).

Configure the EB CLI:
* [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html)
* Note: this process only initializes the current directory/repository on your computer. The relevant files have been added to gitignore.
1. Go to project directory root (where this file is). Type: `eb init`.
2. Select `eu-west-1` as the location (unless something's been changed).
3. If you haven't set up your AWS credentials yet, provide your personal Access key ID and Secret access key. You got them when receiving the AWS credentials (you should have got the following: **User name,Password,Access key ID,Secret access key,Console login link**). On Linux/OS X, the credentials will be stored in `~/.aws/config`.
4. Select the `liikuntaliput` as application and default environment. Don't continue with CodeCommit (defaults to N).
5. Ensure the environment is set up by typing `eb list`. You should see **liikuntaliput**.

**Deploy a new version to production:**
* While in the project root directory, type: `eb deploy liikuntaliput`
* To see how things are progressing, type: `eb events -f`

# Documentation of used APIs

See (API)[documentation/README.md]

# Updating prices

See the file backend/src/utils/courses.js
There are the following environment variables:

    const POOL_WATER_PRICE_BEFORE_4 = process.env.POOL_WATER_PRICE_BEFORE_4 || 2.0;
    const POOL_WATER_PRICE_AFTER_4 = process.env.POOL_WATER_PRICE_AFTER_4 || 3.0;
    const FLOOR_GYM_PRICE_BEFORE_4 = process.env.FLOOR_GYM_PRICE_BEFORE_4 || 3.0;
    const FLOOR_GYM_PRICE_AFTER_4 = process.env.FLOOR_GYM_PRICE_AFTER_4 || 4.5;
    const DEFAULT_PRICE = process.env.DEFAULT_PRICE || 3.0;

Update the new price to AWS environment configuration.
