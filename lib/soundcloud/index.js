const queryString = require('querystring');
const opn = require('opn');

module.exports.connect = ({ clientId, redirectUri, responseType, scope = '*', display, state }) => {
  const query = queryString({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
    display,
    state
  });

  const url = 'https://soundcloud.com/connect?' + query

  opn(url);

  
}


