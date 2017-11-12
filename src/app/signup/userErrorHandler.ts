export class UserErrorHandler {
  public static parseErrors(error) {
    const errorMessage: string = error.toString();
    let errorObj: any = {};
    // The errors are a little bit different for this one, so we need to do some parsing ourselves
    if ( -1 !== errorMessage.search('Error: GraphQL error: Operation failed uniqueness constraint: ')) {
      if (-1 !== errorMessage.search('email')) {
        errorObj.error = 'Email already in use.';
        errorObj.type = 'email';
      } else if (-1 !== errorMessage.search('username')) {
        errorObj.error = 'Username already in use';
        errorObj.type = 'username';
      }
    } else {
      errorObj.message = errorMessage;
    }
    return errorObj;
  }
}
