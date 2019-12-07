const queryString = require('querystring');
const open = require('open');

module.exports.connect = ({ clientId, redirectUri, responseType, scope = '*', display, state }) => {
  const query = queryString.encode({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
    display,
    state
  });

  const url = 'https://soundcloud.com/connect?' + query

  open(url);


}


