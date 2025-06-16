import { Configuration } from '@getopenpay/client';
import OpenPayClient from '@getopenpay/client/client';

const config = new Configuration({
  basePath: 'https://connto.getopenpay.com',
  apiKey: 'pt_prod_vq64EnWGXJYe7QnU02Oijg',        // Replace with production token
  accessToken: 'st_prod_Kgpdqna37a24Q4JqNQSSFw'     // Replace with your secret token
});

const client = new OpenPayClient(config);
const customerId = 'cus_prod_HYQfbgPeDoFsN1Hv';
const now = Date.now();

async function createOverageInvoiceWithSDK() {
  try {
    // Step 1: Create Product
    const product = await client.productsApi.createProduct({
      createProductRequest: {
        name: `Overage Credits - ${now}`,
        description: 'Charge for extra usage',
      },
    });

    // Step 2: Create Price
    const costPerCredit = 0.000005;
    const overageCredits = 1234567;
    const unitAmountAtom = Math.round(costPerCredit * 100); // 0.000005 → 0.0005 cents → rounded to 0

    const price = await client.pricesApi.createPriceForProduct({
      createPriceRequest: {
        productId: product.id,
        priceType: 'one_time',
        pricingModel: 'standard',
        currency: 'usd',
        unitAmountAtom: 1, // Use 1 cent instead of zero — OpenPay requires minimum non-zero amount
        isActive: true,
        isDefault: true,
      },
    });

    console.log(`✅ Created price: $0.01 per unit (simulated)`);

    // Step 3: Get Customer Payment Method
    const paymentMethods = await client.customersApi.listCustomerPaymentMethods({
      customerId,
      customerPaymentMethodQueryParams: {}
    });

    const paymentMethod = paymentMethods.data?.[0];
    if (!paymentMethod) throw new Error('Customer has no payment methods');

    // Step 4: Create Invoice
    const invoice = await client.invoicesApi.createInvoice({
      createInvoiceRequest: {
        customerId,
        paymentMethodId: paymentMethod.id,
        invoiceType: 'one_off',
        collectionMethod: 'charge_automatically',
        description: `Overage invoice - ${new Date().toLocaleDateString()}`,
        selectedProductPriceQuantity: [{
          priceId: price.id,
          quantity: overageCredits
        }]
      }
    });

    console.log(`🧾 Invoice created successfully: ${invoice.id}`);

  } catch (err: any) {
    console.error('❌ Failed to create invoice:', err.response?.data || err);
  }
}

createOverageInvoiceWithSDK();
