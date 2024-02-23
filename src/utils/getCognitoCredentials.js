import { Auth } from 'aws-amplify';

async function getCognitoCredentials() {
  try {

    // const authenticatedUser = await Auth.currentAuthenticatedUser();
    const resp = await Auth.currentSession()
    const accessToken = resp.getAccessToken().getJwtToken()
  
    return accessToken
  } catch(err) {
    console.log(err);
  }
};
export default getCognitoCredentials;