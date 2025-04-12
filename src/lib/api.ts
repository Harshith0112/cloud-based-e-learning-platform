import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.eduverse.com';

// Cognito configuration
const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
  ClientId: process.env.REACT_APP_CLIENT_ID!,
};

const userPool = new CognitoUserPool(poolData);

export interface CognitoUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const auth = {
  signUp: async (email: string, password: string, firstName: string, lastName: string, role: string) => {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
          { Name: 'custom:role', Value: role },
        ],
        [],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  },

  login: async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('idToken', idToken);
          localStorage.setItem('refreshToken', refreshToken);

          resolve({ accessToken, idToken, refreshToken });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  logout: () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: () => {
    return new Promise<CognitoUser>((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        reject(new Error('No user found'));
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
            return;
          }

          const user: CognitoUser = {
            email: attributes?.find(attr => attr.Name === 'email')?.Value || '',
            firstName: attributes?.find(attr => attr.Name === 'given_name')?.Value || '',
            lastName: attributes?.find(attr => attr.Name === 'family_name')?.Value || '',
            role: attributes?.find(attr => attr.Name === 'custom:role')?.Value || '',
          };

          resolve(user);
        });
      });
    });
  },
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.json();
  },
};

export const courses = {
  getAll: () => api.get('/courses'),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

export const enrollments = {
  enroll: (userId: string, courseId: string) => api.post('/enrollments', { userId, courseId }),
  getEnrollments: (userId: string) => api.get(`/enrollments/${userId}`),
  unenroll: (userId: string, courseId: string) => api.delete(`/enrollments/${userId}/${courseId}`),
}; 