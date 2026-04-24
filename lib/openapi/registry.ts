import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { uploadVideoSchema, videoSchema } from '@/lib/shared/video/schema';

export const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get',
  path: '/api/video',
  tags: ['Video'],
  summary: 'Get all videos',
  responses: {
    200: {
      description: 'List of videos',
      content: {
        'application/json': {
          schema: videoSchema.array(),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
});
registry.registerPath({
  method: 'post',
  path: '/api/video',
  tags: ['Video'],
  summary: 'Create a video',
  request: {
    body: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                example: 'Video Title',
              },
              description: {
                type: 'string',
                example: 'Video Description',
              },
              file: {
                type: 'string',
                format: 'binary',
              },
            },
            required: ['title', 'description', 'file'],
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Video created successfully',
      content: {
        'application/json': {
          schema: videoSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/video/{id}',
  tags: ['Video'],
  summary: 'Delete video',
  request: {
    params: videoSchema.pick({
      id: true,
    }),
  },
  responses: {
    200: {
      description: 'Video deleted succesfully',
      content: {
        'application/json': {
          schema: videoSchema.array(),
        },
      },
    },
    404: {
      description: 'Video not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Video not found',
              },
            },
          },
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
});
