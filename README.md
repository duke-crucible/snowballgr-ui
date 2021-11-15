# SnowballGR UI

## Project Description

Snowball Study is a Duke University Respondent-Driven Sampling for Respiratory Disease Surveillance research project (https://sites.duke.edu/snowball/).
Based on this study, Duke Crucible team has worked on a general release that aims to be used in other types of infectious disease studies. The general release
is named `SnowballGR` and it contains [UI repo](https://github.com/duke-crucible/snowbalgr-ui.git) and [API repo](https://github.com/duke-crucible/snowbalgr-api.git).

Snowballgr-UI is the frontend of SnowballGR applicaiton. It is based on [Create React App](https://facebook.github.io/create-react-app/), [React Router](https://reactrouter.com/), and [Ant Design](https://ant.design).

## Local Development

Use [yarn](https://classic.yarnpkg.com/en/) to manage packages. It is like npm but uses a cache to install packages faster.

### Environment variables

One environment variable `REACT_APP_API_ROOT` must be set in `.env` file before running this stack locally. There is `.env.example` file in the repo that you may copy to `.env` file for running locally.

### Install and Run

1. Clone this repo:

   ```bash
   git clone https://github.com/duke-crucible/snowballgr-ui.git
   cd snowballgr-ui
   ```

2. Set up the environment variables:

   ```bash
   cp .env.example .env
   ```

3. Build and Run
   Make sure you have Docker installed and running on your local, use below docker-compose commands to build and run:

   ```bash
   yarn install
   yarn start
   ```

   Now you should have a running React app at http://localhost:3000.

4. Integrate with API

   Follow [instructions](https://github.com/duke-crucible/snowballgr-api#local-development) to bring up a local instance of Snowballgr-API.

5. Shell into the container:
   ```bash
   docker-compose exec app bash
   ```

As you edit code the server will automatically reload to pick up your changes. Sometimes you might need to shut down the server and rebuild the Docker images, for example if you add a new dependency. You can do this with `docker-compose stop` followed by `docker-compose build` and then restart the server with `docker-compose up`.

## CI/CD

CI/CD configuration is not included in this repo. You need to add your own CICD configuration.

## Deployment

This project can be deployed to any cloud services, e.g. Azure, AWS. Below is a step-by-step guide to deploy snowballgr-ui to Azure App Service from [Azure Portal](https://portal.azure.com), refer to [Azure Documents](https://docs.microsoft.com/en-us/azure/?product=featured) for more information on deployment to Azure. Note before this deployment you should have completed [snowballgr-api deployment](https://github.com/duke-crucible/snowballgr-api#deployment), if not, follow the link to bring up SnowballGR backend application and mongo db.

1. Build, tag and push docker image to acr, this can be done from your terminal or from IDE (e.g. VSCode). Below is an example of doing so from terminal, assuming the resource group is named `Snowballgr-RG` and the acr name is `snowballgracr`

   - Make sure you are using the correct subscription, you may use following command to set it to your subscription:

   ```bash
   az account set --subscription <subscription>
   ```

   - Run following commands from snowballgr-ui directory:

   ```bash
   docker build . -t snowballgr-ui:latest
   docker tag snowballgr-ui:latest snowballgracr.azurecr.io/snowballgr-ui:latest
   az acr credential show --resource-group Snowballgr-RG --name snowballagrcr
   docker login snowballgracr.azurecr.io --username <username>
   ```

   Replace `username` with values from the output of previous command. When prompted, type in one of the passwords from the previous step.

   ```bash
   docker push snowballgracr.azurecr.io/snowballgr-ui:latest
   ```

   This may take some time in the first attempt. After push succeeds, go back to Azure portal, go to the acr (e.g. snowballgracr), under `Services` in the left pane, click `Repositories`, you should be able to find the image in the repository of snowballgr-ui.

2. On [Azure portal](https://portal.azure.com/#home) select your subscription under which you want SnowballGR application to run
3. From left pane select Resource groups, then select the resource group to which your backend and db belong
4. Deploy snowballgr-ui to Azure App Service
   - Click `+ Create` and select `Web App`
   - Enter basic informtion: Web App name (e.g. `snowballgr`), select Docker Container for Publish, select Linux as Operating System, select your region and your existing service plan, then go to Docker page
   - On Docker page, select Single Conainer and Azure Container Registry as Image Source, then select your acr name, choose the image to run, no need to provide startup command
   - Click `Review+create` button, review your settings then click `Create`
   - Once deployment is complete, click `Go to resource`. Click `Configuration` under `Settings` in the left pane.
   - Click `+ New application setting`, set environment variable `REACT_APP_API_ROOT` to the backend app service url (e.g. `https://snowballgr-api.azurewebsites.net`)
   - Save your configuration, this should trigger your web app restarted
   - Wait for 5 minutes, click `Overview` in the left pane then click URL (e.g. https://snowballgr.azurewebsites.net), you should get SnowballGR home page.
