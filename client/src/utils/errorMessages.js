const errorMessages = {
  'auth-user-error': 'Please Login! You have not loggedin',
  'login-user-error': 'Failed to login with Twitter. Please try again! Or use another account.',
  'database-user-error': 'Failed to update user information. Please try again!',
  'twitter-error': 'Failed to connect to Twitter. Please try again!',
  'server-error' : 'Failed to connect to Server. Please try again!'
};

const pickErrorMessage = (code) => {
  if(!code) {
    return '';
  }
  code = errorMessages[code] ? code : 'server-error';
  return errorMessages[code];
}

export default pickErrorMessage;