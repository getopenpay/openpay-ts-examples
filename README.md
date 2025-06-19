# OpenPay TypeScript Examples

This repository is a collection of practical TypeScript demo projects showing how to use the OpenPay API via the TypeScript SDK (`@getopenpay/client`). These examples cover common tasks in OpenPay integrations – from creating checkout sessions to handling webhooks and invoices with TypeScript.

## Examples

This repository includes several examples (each in its own folder) giving more details on how to work with OpenPay’s use cases:

- **Hosted Checkout:** Shows how to create a hosted checkout session with OpenPay’s REST API and redirects the user to a payment page. Using the TypeScript SDK, the example calls `client.checkoutApi.createCheckoutSession(...)` to generate a session and then redirects to `checkoutSession.url`. This mirrors the OpenPay docs example for creating a subscription checkout.
- **One-time Invoice:** This showcases creating and paying a one-off invoice via the API. OpenPay supports one-time (non-subscription) invoices for single purchases. This example uses the SDK to draft an invoice (`createInvoice`) for a customer and then finalize/pay it. The code closely follows the official recipe for one-off payments (creating an invoice with `invoiceType=ONE_OFF` and then finalizing it).
- **Metered (Overage) Billing:** This example shows to simulate an overage-style one-time charge using OpenPay's REST API (without subscriptions or metered tiers). This example creates a product and a one-time price, and then immediately generates an invoice using raw `axios` calls. It’s useful when you want to charge customers for excess usage via APIs in a single invoice.

## OpenPay SDK Version

These examples use the official OpenPay TypeScript SDK package `@getopenpay/client`. At the time of writing, the latest version is **0.0.17**. All example code assumes this (or a compatible) version of the SDK is installed. Make sure your `package.json` references the same version or newer.

## Setup & Installation

1. **Clone the repo:**
    
    ```bash
    git clone https://github.com/getopenpay/openpay-ts-examples.git
    cd openpay-ts-examples
    ```
    
2. **Install dependencies:**
    
    Each example uses Node.js and npm. From the root (or inside an example folder), run:
    
    ```bash
    npm install
    ```
    
    This will install the OpenPay client and other dependencies. (For example, you should see `@getopenpay/client` installed – you can also run `npm install @getopenpay/client` explicitly as shown in the code that works with OpenPay’s SDK.)
    
3. **Configure API keys:**
    
    You need to supply your OpenPay **Publishable Key** and **Secret Key**. Edit the example’s configuration (often in code or a `.env` file) to include:
    
    ```tsx
    const config = new Configuration({
      basePath: 'https://connto.getopenpay.com', // or staging URL
      apiKey: 'YOUR_PUBLISHABLE_KEY',
      accessToken: 'YOUR_SECRET_KEY'
    });
    const client = new OpenPayClient(config);
    ```
    
    (This follows the official setup pattern in the [hosted checkout docs](https://docs.getopenpay.com/product-fundamentals/receiving-payments/hosted-checkout-form#:~:text=import%20,getopenpay%2Fclient%27%3B%20import%20OpenPayClient%20from%20%27%40getopenpay%2Fclient%2Fclient).) Replace the placeholders with your actual API credentials from the OpenPay dashboard.
    
4. **Other settings:**
    - Make sure you have Node.js ≥14 installed.

## Usage

Each example typically runs as a small server or script. To launch an example:

- Navigate into the example’s directory.
- Run `npm install` (if not already done) and then start the app, e.g.:
    
    ```bash
    npm run start
    ```
    
    or
    
    ```bash
    npx ts-node src/index.ts
    ```
    
- Follow any on-screen logs or instructions. For instance, the Hosted Checkout example may listen on a port and provide a “Subscribe” button.

## Learn More

For detailed API references and guides, see the [OpenPay’s Official documentation](https://www.notion.so/Docs-v2-1d8ce205d0e480819f6fcf49c8dfc65e?pvs=21).
