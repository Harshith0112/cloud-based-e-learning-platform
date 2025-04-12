import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDB({ region: process.env.AWS_REGION });
const s3 = new S3({ region: process.env.AWS_REGION });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        return await handleGetCourses(event);
      case 'POST':
        return await handleCreateCourse(event);
      case 'PUT':
        return await handleUpdateCourse(event);
      case 'DELETE':
        return await handleDeleteCourse(event);
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

async function handleGetCourses(event: APIGatewayProxyEvent) {
  try {
    const { Items } = await dynamoDB.scan({
      TableName: process.env.COURSES_TABLE!,
    });

    const courses = Items?.map(item => unmarshall(item)) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(courses),
    };
  } catch (error) {
    console.error('Error getting courses:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching courses' }),
    };
  }
}

async function handleCreateCourse(event: APIGatewayProxyEvent) {
  try {
    const body = JSON.parse(event.body || '{}');
    const courseId = uuidv4();

    // Upload thumbnail to S3 if provided
    let thumbnailUrl = body.thumbnail;
    if (body.thumbnailFile) {
      const base64Data = body.thumbnailFile.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const key = `courses/${courseId}/thumbnail.jpg`;
      await s3.putObject({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      });

      thumbnailUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }

    const course = {
      id: courseId,
      title: body.title,
      description: body.description,
      instructor: body.instructor,
      duration: body.duration,
      level: body.level,
      category: body.category,
      thumbnail: thumbnailUrl,
      price: body.price,
      published: body.published || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB.putItem({
      TableName: process.env.COURSES_TABLE!,
      Item: marshall(course),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(course),
    };
  } catch (error) {
    console.error('Error creating course:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating course' }),
    };
  }
}

async function handleUpdateCourse(event: APIGatewayProxyEvent) {
  try {
    const courseId = event.pathParameters?.id;
    const body = JSON.parse(event.body || '{}');

    // Get existing course
    const { Item } = await dynamoDB.getItem({
      TableName: process.env.COURSES_TABLE!,
      Key: marshall({ id: courseId }),
    });

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Course not found' }),
      };
    }

    const existingCourse = unmarshall(Item);

    // Handle thumbnail update if provided
    let thumbnailUrl = existingCourse.thumbnail;
    if (body.thumbnailFile) {
      const base64Data = body.thumbnailFile.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const key = `courses/${courseId}/thumbnail.jpg`;
      await s3.putObject({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      });

      thumbnailUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }

    const updatedCourse = {
      ...existingCourse,
      ...body,
      thumbnail: thumbnailUrl,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB.putItem({
      TableName: process.env.COURSES_TABLE!,
      Item: marshall(updatedCourse),
    });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedCourse),
    };
  } catch (error) {
    console.error('Error updating course:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating course' }),
    };
  }
}

async function handleDeleteCourse(event: APIGatewayProxyEvent) {
  try {
    const courseId = event.pathParameters?.id;

    // Delete course from DynamoDB
    await dynamoDB.deleteItem({
      TableName: process.env.COURSES_TABLE!,
      Key: marshall({ id: courseId }),
    });

    // Delete course content from S3
    const objects = await s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME!,
      Prefix: `courses/${courseId}/`,
    });

    if (objects.Contents?.length) {
      await s3.deleteObjects({
        Bucket: process.env.BUCKET_NAME!,
        Delete: {
          Objects: objects.Contents.map(obj => ({ Key: obj.Key! })),
        },
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Course deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting course:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting course' }),
    };
  }
} 