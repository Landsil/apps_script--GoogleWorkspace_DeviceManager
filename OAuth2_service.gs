/***
https://github.com/googleworkspace/apps-script-oauth2
*/
// Email address of the user to impersonate. In most cases this you will be your email.
var user_email = '<email>';


function getOAuthService() {
  return OAuth2.createService('Service Account')
    // Set the endpoint URLs
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')

    // Set the client ID and secret
    .setPrivateKey(private_key)
    .setIssuer(client_email)

    .setSubject(user_email)

    // Set the property store where authorized tokens should be persisted
    .setPropertyStore(PropertiesService.getScriptProperties())
    // .setCache(CacheService.getUserCache())

    .setParam('access_type', 'offline')
    .setScope('https://www.googleapis.com/auth/cloud-identity https://www.googleapis.com/auth/cloud-identity.devices https://www.googleapis.com/auth/cloud-platform');
}

function reset() {
  var service = getOAuthService();
  service.reset();
}


// Not needed here, as we are using JSON for auth
// function getCloudIdentityService() {
//   // Create a new service with the given name. The name will be used when
//   // persisting the authorized token, so ensure it is unique within the
//   // scope of the property store.
//   return OAuth2.createService('CloudIdentity')

//       // Set the endpoint URLs, which are the same for all Google services.
//       .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
//       .setTokenUrl('https://accounts.google.com/o/oauth2/token')

//       // Set the client ID and secret, from your project's OAuth screen
//       .setClientId(ClientID)
//       .setClientSecret(ClientSecret)

//       // Set the name of the callback function in the script referenced
//       // above that should be invoked to complete the OAuth flow.
//       .setCallbackFunction('authCallback')

//       // Set the property store where authorized tokens should be persisted.
//       .setPropertyStore(PropertiesService.getUserProperties())
//       .setCache(CacheService.getUserCache())

//       // Set the scopes to request (space-separated for Google services).
//       .setScope('https://www.googleapis.com/auth/cloud-identity')

//       // Below are Google-specific OAuth2 parameters.

//       // Sets the login hint, which will prevent the account chooser screen
//       // from being shown to users logged in with multiple accounts.
//       .setParam('login_hint', Session.getEffectiveUser().getEmail())

//       // Requests offline access.
//       .setParam('access_type', 'offline')

//       // Consent prompt is required to ensure a refresh token is always
//       // returned when requesting offline access.
//       .setParam('prompt', 'consent');
// }
// 
// 
// function showSidebar() {
//   var CloudIdentityService = getCloudIdentityService();
//   if (!CloudIdentityService.hasAccess()) {
//     var authorizationUrl = CloudIdentityService.getAuthorizationUrl();
//     var template = HtmlService.createTemplate(
//         '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
//         'Reopen the sidebar when the authorization is complete.');
//     template.authorizationUrl = authorizationUrl;
//     var page = template.evaluate();
//     SpreadsheetApp.getUi().showSidebar(page);
//   } else {
//   // ...
//   }
// }
// 
// function authCallback(request) {
//   var CloudIdentityService = getCloudIdentityService();
//   var isAuthorized = CloudIdentityService.handleCallback(request);
//   if (isAuthorized) {
//     return HtmlService.createHtmlOutput('Success! You can close this tab.');
//   } else {
//     return HtmlService.createHtmlOutput('Denied. You can close this tab');
//   }
// }
