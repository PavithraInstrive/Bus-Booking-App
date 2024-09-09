const dotenv = require("dotenv");

switch (process.env.NODE_ENV) {
  case "production":
    dotenv.config({ path: "./production.env" });
    break;
  case "staging":
    dotenv.config({ path: "./staging.env" });
    break;
  case "development":
    dotenv.config({ path: "./dev.env" });
    break;
  default:
    dotenv.config({ path: "./local.env" });
    break;
}

const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const userAgent = require("express-useragent");
const bodyParser = require("body-parser");
const boom = require("@hapi/boom");
const requestIp = require("request-ip");
const logError = require("./system/middleware/log-error");
const errorHandler = require("./system/error/handler");
const cors = require("cors");
// const swaggerSpec = require('./docs');
const middlewareConfig = require("./system/config/middleware");
const publicRouters = require("./routers/publicRouter");
const privateRouters = require("./routers/privateRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");
const path = require("path");

const corsOptions = {
  origin: ["http://localhost:8080", "http://your-allowed-origin.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(userAgent.express());
app.use(express.json());
// app.use(cors(middlewareConfig.cors));
app.use(helmet());
app.use(morgan(middlewareConfig.morganRequestFormat));
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());
app.use(requestIp.mw());

app.get("/", (req, res) => {
  console.log(`Health is A OK .ENV ${process.env.NODE_ENV}`);
  res.send({ msg: `Health is A OK .ENV ${process.env.NODE_ENV}` });
});

// const appointmentDocument = YAML.load('./api/Appointment/swagger.yaml');
const userDocument = YAML.load('./api/User/swagger.yaml');

// const combinedSwaggerDocument = {
//     openapi: '3.0.0',
//     info: {
//       title: 'Bus Booking API',
//       version: '1.0.0',
//       description: 'API documentation for both Appointment and User modules',
//     },
//     servers: [
//       {
//         url: 'http://localhost:8080/api',
//       },
//     ],
//     paths: {
//     //   ...appointmentDocument.paths,
//       ...userDocument.paths,
//     },
//     components: {
//     //   ...appointmentDocument.components,
//       ...userDocument.components,
//     },
//   };

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedSwaggerDocument));

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Bus Booking API',
      version: '1.0.0',
      description: 'API documentation for the Bus Booking application',
      contact: {
        name: 'Your Name',
        email: 'youremail@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Development server',
      },
    ],
  };

  const swaggerOptions = {
    swaggerDefinition,
    apis: [
      path.join(__dirname, 'api/**/swagger.yaml'),
    ],
  };
  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


publicRouters(app);
privateRouters(app);

app.use((req, res, next) => {
  throw boom.notFound("Endpoint Not Found");
});

app.use(logError);
app.use(errorHandler.token);
app.use(errorHandler.validation);
app.use(errorHandler.all);

module.exports = app;
