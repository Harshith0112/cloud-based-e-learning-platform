import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action, ...params } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'signup':
        return await handleSignUp(params);
      case 'confirmSignUp':
        return await handleConfirmSignUp(params);
      case 'login':
        return await handleLogin(params);
      case 'forgotPassword':
        return await handleForgotPassword(params);
      case 'confirmForgotPassword':
        return await handleConfirmForgotPassword(params);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

async function handleSignUp(params: any) {
  const { email, password, firstName, lastName, role } = params;

  const command = new SignUpCommand({
    ClientId: process.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
      { Name: 'custom:role', Value: role },
    ],
  });

  const response = await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User created successfully', userId: response.UserSub }),
  };
}

async function handleConfirmSignUp(params: any) {
  const { email, code } = params;

  const command = new ConfirmSignUpCommand({
    ClientId: process.env.CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });

  await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User confirmed successfully' }),
  };
}

async function handleLogin(params: any) {
  const { email, password } = params;

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const response = await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify({
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    }),
  };
}

async function handleForgotPassword(params: any) {
  const { email } = params;

  const command = new ForgotPasswordCommand({
    ClientId: process.env.CLIENT_ID,
    Username: email,
  });

  await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Password reset code sent' }),
  };
}

async function handleConfirmForgotPassword(params: any) {
  const { email, code, newPassword } = params;

  const command = new ConfirmForgotPasswordCommand({
    ClientId: process.env.CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  });

  await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Password reset successful' }),
  };
} 