import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const cognito = new CognitoIdentityProvider({ region: process.env.AWS_REGION });
const dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });

const USER_POOL_ID = process.env.USER_POOL_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action } = event.pathParameters!;
    const body = JSON.parse(event.body || '{}');

    switch (action) {
      case 'signup':
        return await handleSignup(body);
      case 'login':
        return await handleLogin(body);
      case 'verify':
        return await handleVerify(body);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

async function handleSignup(body: any) {
  const { email, password, firstName, lastName, role } = body;

  try {
    // Create user in Cognito
    const signUpResponse = await cognito.signUp({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'custom:role', Value: role },
      ],
    });

    // Create user in DynamoDB
    await dynamoDB.putItem({
      TableName: process.env.USERS_TABLE!,
      Item: marshall({
        email,
        id: signUpResponse.UserSub,
        firstName,
        lastName,
        role,
        status: 'Active',
        joinDate: new Date().toISOString(),
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error creating user' }),
    };
  }
}

async function handleLogin(body: any) {
  const { email, password } = body;

  try {
    const authResponse = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    // Get user details from DynamoDB
    const userResponse = await dynamoDB.getItem({
      TableName: process.env.USERS_TABLE!,
      Key: marshall({ email }),
    });

    const user = unmarshall(userResponse.Item!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: authResponse.AuthenticationResult?.AccessToken,
        idToken: authResponse.AuthenticationResult?.IdToken,
        refreshToken: authResponse.AuthenticationResult?.RefreshToken,
        user,
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid credentials' }),
    };
  }
}

async function handleVerify(body: any) {
  const { email, code } = body;

  try {
    await cognito.confirmSignUp({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email verified successfully' }),
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error verifying email' }),
    };
  }
} 