import axios from 'axios';

const BASE_URL = 'https://connto.openpaystaging.com';
const SECRET_KEY = 'st_stg_...'
const CUSTOMER_ID = 'cus_stg_...'
const PRICE_ATOM = 1
const QUANTITY = 10

async function createOverageInvoiceREST() {
  try {
    // Create a product
    const createProductResponse = await axios.post(`${BASE_URL}/products/`, {
      description: '',
      is_active: true,
      name: 'overage'
    }, {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const productId = createProductResponse.data.id;

    // Create a price for that product
    const createPriceResponse = await axios.post(`${BASE_URL}/prices/`, {
      currency: 'usd',
      is_active: true,
      is_default: false,
      is_exclusive: false,
      price_type: 'one_time',
      pricing_model: 'standard',
      product_id: productId,
      transform_quantity_divide_by: 1,
      unit_amount_atom: PRICE_ATOM,
      usage_type: 'licensed'
    }, {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const priceId = createPriceResponse.data.id;

    // Create a one time invoice using the product
    const createInvoiceResponse = await axios.post(`${BASE_URL}/invoices/`, {
      collection_method: 'send_invoice',
      customer_id: CUSTOMER_ID,
      email_invoice_on_finalization: false,
      finalize_invoice_immediately: true,
      invoice_type: 'one_off',
      selected_product_price_quantity: [{
        price_id: priceId,
        quantity: QUANTITY
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Product created:', createProductResponse.data);
    console.log('Price created:', createPriceResponse.data);
    console.log('Invoice created:', createInvoiceResponse.data);

  } catch (error) {
    console.error('Error: ', error);
  }
}

createOverageInvoiceREST();