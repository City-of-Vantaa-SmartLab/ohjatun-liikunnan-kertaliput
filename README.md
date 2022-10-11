# Vantaa Exercise Reservations

## Architecture

This project is simple client-server application built with

-   Frontend: React.js & MobX
-   Backend: Node.js & Express.js
-   Database: PostgreSQL

It integrates to Grynos to get the information about current courses available in Vantaa.

---

## Running locally

Log in to AWS account `vantaa-pwa` and navigate to Elastic Beanstalk on `eu-west-1` region.
Go to Environments > `jumppaliput-vantaa-dev` > Configuration, and click the Edit button of the Software
category. Populate the environment variables inside `docker-compose.yml` with values from the environment
configuration. If you want to use seeded mock data in the database, set POPULATE_SEED_DATA to 1 in docker-compose.yml.

Finally, run

```
. ./run-locally.sh
```

This local development includes hot reloading on the back-end.
Backend responds at: http://localhost:5000/

---

## Deployment

The application runs in `vantaa-pwa` AWS account's Elastic Beanstalk in Ireland region `eu-west-1`. App
environments can be updated using EB CLI tools:

Install the tools (for quick setup, follow the README in GitHub):

-   [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
-   [GitHub](https://github.com/aws/aws-elastic-beanstalk-cli-setup)
-   Remember to add EB CLI to PATH (e.g. `export PATH="/home/username/.ebcli-virtual-env/executables:$PATH"`).

Configure the EB CLI:

-   [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html)
-   Note: this process only initializes the current directory/repository on your computer. The relevant files have been added to gitignore.

1. Go to project directory root (where this file is). Type: `eb init`.
2. Select `eu-west-1` as the location (unless something's been changed).
3. If you haven't set up your AWS credentials yet, provide your personal Access key ID and Secret access key. These can be generated in the AWS IAM console.
    - Be sure to use the credentials for the correct account, since they determine where the app will be deployed!
4. Select the `liikuntaliput` as application and `liikuntaliput-dev` as the default environment. Don't continue with CodeCommit (defaults to Y).
5. Ensure the environment is set up by typing `eb list`. You should see that the development environment is selected:

```
jumppaliput-vantaa-prod
* jumppaliput-vantaa-dev
```

_Note: only committed changes are going to be deployed._

### Deploy a new version to the development environment

-   Run `eb use jumppaliput-vantaa-dev` to switch to the development environment
-   Run `eb deploy`
-   Optionally, to see how things are progressing, run `eb events -f`

### Deploy a new version to the production environment

-   Run `eb use jumppaliput-vantaa-prod` to switch to the production environment
-   Run `eb deploy`
-   Optionally, to see how things are progressing, run `eb events -f`

---

## Documentation of used APIs

See (API)[documentation/README.md]

---

## Updating prices

See the file backend/src/utils/courses.js
There are the following environment variables:

    const POOL_WATER_PRICE_BEFORE_4 = process.env.POOL_WATER_PRICE_BEFORE_4 || 2.0;
    const POOL_WATER_PRICE_AFTER_4 = process.env.POOL_WATER_PRICE_AFTER_4 || 3.0;
    const FLOOR_GYM_PRICE_BEFORE_4 = process.env.FLOOR_GYM_PRICE_BEFORE_4 || 3.0;
    const FLOOR_GYM_PRICE_AFTER_4 = process.env.FLOOR_GYM_PRICE_AFTER_4 || 4.5;
    const DEFAULT_PRICE = process.env.DEFAULT_PRICE || 3.0;

Update the new price to AWS environment configuration.
