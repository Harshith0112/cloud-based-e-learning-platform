import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case 'POST':
        return await handleEnroll(event);
      case 'GET':
        return await handleGetEnrollments(event);
      case 'DELETE':
        return await handleUnenroll(event);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' }),
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

async function handleEnroll(event: APIGatewayProxyEvent) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, courseId } = body;

    // Check if user exists
    const userResponse = await dynamoDB.getItem({
      TableName: process.env.USERS_TABLE!,
      Key: marshall({ id: userId }),
    });

    if (!userResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Check if course exists
    const courseResponse = await dynamoDB.getItem({
      TableName: process.env.COURSES_TABLE!,
      Key: marshall({ id: courseId }),
    });

    if (!courseResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Course not found' }),
      };
    }

    // Check if already enrolled
    const enrollmentResponse = await dynamoDB.getItem({
      TableName: process.env.ENROLLMENTS_TABLE!,
      Key: marshall({
        userId,
        courseId,
      }),
    });

    if (enrollmentResponse.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Already enrolled in this course' }),
      };
    }

    // Create enrollment
    const enrollment = {
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
    };

    await dynamoDB.putItem({
      TableName: process.env.ENROLLMENTS_TABLE!,
      Item: marshall(enrollment),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(enrollment),
    };
  } catch (error) {
    console.error('Error enrolling:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error enrolling in course' }),
    };
  }
}

async function handleGetEnrollments(event: APIGatewayProxyEvent) {
  try {
    const userId = event.pathParameters?.userId;

    const { Items } = await dynamoDB.query({
      TableName: process.env.ENROLLMENTS_TABLE!,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
      }),
    });

    const enrollments = Items?.map(item => unmarshall(item)) || [];

    // Get course details for each enrollment
    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async enrollment => {
        const { Item } = await dynamoDB.getItem({
          TableName: process.env.COURSES_TABLE!,
          Key: marshall({ id: enrollment.courseId }),
        });

        return {
          ...enrollment,
          course: Item ? unmarshall(Item) : null,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(enrollmentsWithCourses),
    };
  } catch (error) {
    console.error('Error getting enrollments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching enrollments' }),
    };
  }
}

async function handleUnenroll(event: APIGatewayProxyEvent) {
  try {
    const userId = event.pathParameters?.userId;
    const courseId = event.pathParameters?.courseId;

    await dynamoDB.deleteItem({
      TableName: process.env.ENROLLMENTS_TABLE!,
      Key: marshall({
        userId,
        courseId,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully unenrolled from course' }),
    };
  } catch (error) {
    console.error('Error unenrolling:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error unenrolling from course' }),
    };
  }
} 