/**
 * This file includes function to retreive id_token from GoogleAuth
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const { google } = require('googleapis');

/**
 * This function gets id_token from JWT
 *
 * @return {String} id_token required for Authorized call
 *
 */
const getAuthToken = async () => {
  // audiance will your Cloud Run service URL
  const audiance = 'https://my-service-xnadp5wioq-ew.a.run.app'
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const authClient = await auth.getClient();

    const jwtClient = new google.auth.JWT(
      authClient.email,
      null,
      authClient.key,
      audiance,
    );

    return (await jwtClient.authorize()).id_token;
  } catch (err) {
    throw new Error(`Error occured in fetching jwt auth token: ${err}`);
  }
};

module.exports = { getAuthToken };
