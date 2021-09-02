export const environment = {
  production: true,
  cognitoUserPoolId: "eu-west-1_rJGpA7BVH",
  cognitoAppClientId: "3bdgnq3ihck83j6pkl36ccdker" 
};

// define Server here, if you are not in production mode and want to have another server than http://localhost:8080
// for remote server accessing your local gui for e.g. sahi test insert your local rest client here
export const BACKEND_URL =  window.location.origin + "/api";
