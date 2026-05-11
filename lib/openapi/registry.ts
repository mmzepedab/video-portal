import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { videoSchema } from '@/lib/shared/video/schema';

export const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get',
  path: '/api/videos',
  tags: ['Videos'],
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
  method: 'get',
  path: '/api/videos/{id}',
  tags: ['Videos'],
  summary: 'Get video by id',
  request: {
    params: videoSchema.pick({
      id: true,
    }),
  },
  responses: {
    200: {
      description: 'Video found',
      content: {
        'application/json': {
          schema: videoSchema,
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
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/videos',
  tags: ['Videos'],
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
    201: {
      description: 'Video created successfully',
      content: {
        'application/json': {
          schema: videoSchema,
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
  path: '/api/videos/{id}/publish/instagram',
  tags: ['Videos'],
  summary: 'Publish video to Instagram',
  request: {
    params: videoSchema.pick({
      id: true,
    }),
  },
  responses: {
    200: {
      description: 'Video published to Instagram successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Video published to Instagram successfully',
              },
              data: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
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
      description: 'Error publishing video to Instagram',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error publishing video to Instagram',
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
  path: '/api/videos/publish-next/instagram',
  tags: ['Videos'],
  summary: 'Publish next ready video to Instagram',
  responses: {
    200: {
      description: 'Next ready video published to Instagram successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Next ready video published to Instagram successfully',
              },
              data: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
    404: {
      description: 'No ready video found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'No READY videos available to publish',
              },
            },
          },
        },
      },
    },
    500: {
      description: 'Error publishing next video to Instagram',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error publishing next video to Instagram',
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/videos/{id}',
  tags: ['Videos'],
  summary: 'Delete video',
  request: {
    params: videoSchema.pick({
      id: true,
    }),
  },
  responses: {
    200: {
      description: 'Video deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Video deleted successfully',
              },
            },
          },
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
