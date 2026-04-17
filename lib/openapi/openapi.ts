export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Video Portal API',
    version: '1.0.0',
    description: 'Open API definition for the Video Portal',
  },
  paths: {
    '/api/hello': {
      get: {
        summary: 'Returns a hello message',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Hello from API',
                    },
                  },
                  required: ['message'],
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
