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
const path = require("path");
const stripe = require("./system/config/stripe");
const Payment = require('./api/Payment/index');



const corsOptions = {
  origin: ["http://localhost:8080", "http://your-allowed-origin.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan(middlewareConfig.morganRequestFormat));
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

app.get("/", (req, res) => {
  console.log(`Health is A OK .ENV ${process.env.NODE_ENV}`);
  res.send({ msg: `Health is A OK .ENV ${process.env.NODE_ENV}` });
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const paymentDetails = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customer: paymentIntent.customer,
        payment_method: paymentIntent.payment_method,
        created_at: new Date(paymentIntent.created * 1000),
      };

      try {
        const newPayment = new Payment(paymentDetails);
        await newPayment.save();
        console.log('Payment details saved to the database:', newPayment);
      } catch (dbError) {
        console.error('Error saving payment details to the database:', dbError);
        res.status(500).send('Internal Server Error');
        return;
      }

      console.log("PaymentIntent was successful!", paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log('Payment failed:', paymentFailedIntent);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).end();
});



app.use(express.json());
app.use(express.json({ type: 'application/json' }))
app.use(userAgent.express());


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Bus Booking API",
    version: "1.0.0",
    description: "API documentation for the Bus Booking application",
    contact: {
      name: "Your Name",
      email: "youremail@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8080/api",
      description: "Development server",
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [path.join(__dirname, "api/**/swagger.yaml")],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
