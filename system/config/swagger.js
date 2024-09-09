const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bus Booking API',
    version: '1.0.0',
    description: 'API documentation for the Bus Booking application',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
  ],
};

// Options for the swagger docs
const swaggerOptions = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, 'api/**/swagger.yaml'), // Adjust the path to point to all swagger.yaml files
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
