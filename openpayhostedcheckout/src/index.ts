import { Configuration } from '@getopenpay/client';
import OpenPayClient from '@getopenpay/client/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure OpenPay SDK
const config = new Configuration({
  basePath: 'https://connto.getopenpay.com', // Production endpoint
  apiKey: '', //publishable key
  accessToken: '', //secret key
});

const client = new OpenPayClient(config);

// In-memory map to associate your app's users to OpenPay customer IDs
const usersDB = new Map<string, string>();

// Serve a simple front-end page
app.get('/', (_, res) => {
  res.send(`
    <h1>OpenPay Hosted Checkout Demo</h1>
    <button id="checkout">Subscribe</button>
    <script>
      document.getElementById('checkout').onclick = async () => {
        const res = await fetch('/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yourUserId: 'user_123' })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Error: ' + (data.error || 'Unknown'));
        }
      };
    </script>
  `);
});

// API endpoint to create a checkout session
app.post('/subscribe', async (req, response) => {
  try {
    const { yourUserId } = req.body;
    if (!yourUserId) {
       response.status(400).json({ error: 'Missing yourUserId' });
    }

    let customerId = usersDB.get(yourUserId);

    if (!customerId) {
      // Step 1: Create customer
      const createCustomerRequest = {
        email: `${yourUserId}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        zipCode: '94105',
      };

      const customer = await client.customersApi.createCustomer({ createCustomerRequest });
      customerId = customer.id;
      usersDB.set(yourUserId, customerId);
      console.log(`Created OpenPay customer ${customerId} for user ${yourUserId}`);
    }

    // Step 2: Create hosted checkout session
    const checkoutSession = await client.checkoutApi.createCheckoutSession({
      createCheckoutSessionRequest: {
        customerId,
        lineItems: [
          {
            priceId: '', // Replace with your actual price ID
            quantity: 1,
          }
        ],
        mode: 'subscription',
        currency: 'usd',
        returnUrl: 'http://localhost:3000/',
        successUrl: 'http://localhost:3000/success',
      }
    });

     response.json({ url: checkoutSession.url });

  } catch (err: any) {
    console.error('Error creating checkout session:', err.response?.data || err.message);
     response.status(500).json({ error: 'Internal server error' });
  }
});

// Handle success redirect
app.get('/success', (_, res) => {
  res.send('<h1>Subscription successful!</h1>');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});