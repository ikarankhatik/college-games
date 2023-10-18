const Customer = require("../models/customer");
const Principle = require("../models/principle");

const stripe = require("stripe")(
  "sk_test_51NxmblSEekr2cLoVvt2tnHgZZ8mjBusHbOOEYvHpQmnDQKoUBQYv5bA4yVXX1xpf0MM8qd31LqBRcnsBW72hSD7B004tFJqfSB"
);

// module.exports.create = async (req, res) => {
//     const product = req.body;
//     console.log(product);

//     const lineItems = [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: product.name,
//           },
//           unit_amount: product.amount * 199,
//         },
//         quantity: product.qnty, // Adjust the quantity as needed
//       },
//     ];

//     // Create the Stripe Checkout Session using the line items array
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `http://localhost:5173/`,
//       cancel_url: `http://localhost:5173/sign-up`,
//     });

//     res.json({ id: session.id });
//   };

// //config
// module.exports.config =  async (req, res) => {
//   const prices = await stripe.prices.list({
//     lookup_keys: ['sample_basic', 'sample_premium'],
//     expand: ['data.product']
//   });

//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//     prices: prices.data,
//   });
// };
module.exports.config = async (req, res) => {
  try {
    const priceId = "price_1NzGL6SEekr2cLoVKrb8hp9X";
    // Retrieve the specific price by using the Price ID
    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"], // Expand the 'product' data for the price
    });

    // Extract relevant information
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY; // Your Stripe publishable key
    const productName = price.product.name; // Extract the product name
    const productDescription = price.product.description; // Extract the product description
    const productImage = price.product.images[0]; // Extract the product image (assuming there is one)
    const productPrice = price.unit_amount / 100; // Convert the price to the correct currency (assuming it's in cents)

    // Send the updated configuration to the client
    res.send({
      publishableKey,
      productName,
      productDescription,
      productImage,
      productPrice,
      priceId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check if the customer already has a subscription
// module.exports.createSubscription = async (req, res) => {
//   const customerId = req.cookies['customer'];
//   //console.log(customerId);

//   try {
//     // Retrieve the customer from Stripe
//     const subscriptions = await stripe.subscriptions.list({
//       customer: customerId,
//     });
//     // Check if the customer already has a subscription
//     if (subscriptions.data.length > 0) {
//       console.log(";ke;ofwjojwo c owhrtowhiohu");
//       return res.send({ success:false, message: 'You are already subscribed.' });
//     }

//     // If the customer doesn't have a subscription, create one
//     const priceId = req.body.priceId;
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{
//         price: priceId,
//       }],
//       payment_behavior: 'default_incomplete',
//       expand: ['latest_invoice.payment_intent'],
//     });

//     res.send({
//       subscriptionId: subscription.id,
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//     });
//   } catch (error) {
//     return res.status(400).send({ error: { message: error.message } });
//   }
// };

module.exports.createSubscription = async (req, res) => {
  // Simulate authenticated user. In practice this will be the
  // Stripe Customer ID related to the authenticated user.
  const customerId = req.cookies["customer"];

  // Retrieve the customer from Stripe
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });
  // Check if the customer already has a subscription
  if (subscriptions.data.length > 0) {
    const subscriptionStatus = subscriptions.data[0].status; // Assuming there's only one subscription per customer

    if (subscriptionStatus === "active") {
      return res.send({ success: false, message: "You are already subscribed." });
    }    
  }

  // Create the subscription
  const priceId = req.body.priceId;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};

module.exports.subscriptions = async (req, res) => {
  // Simulate authenticated user. In practice this will be the
  // Stripe Customer ID related to the authenticated user.
  const customerId = req.cookies["customer"];

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  res.json({ subscriptions });
};

/// Controller to fetch specific customer details, including subscriptions
module.exports.customerDetails = async (req, res) => {
  try {
    // Simulate authenticated user. In practice, you'll retrieve the Stripe Customer ID
    // associated with the authenticated user from your authentication system or database.
    const customerId = req.cookies["customer"];

    // Fetch the customer's Stripe information
    const customer = await stripe.customers.retrieve(customerId);

    // Extract the customer's email
    const customerEmail = customer.email;

    // Fetch the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    console.log(subscriptions.data);

    // Extract subscription details
    const subscriptionDetails = subscriptions.data.map((subscription) => ({
      id: subscription.id,
      name: subscription.plan.metadata.Name, // Replace 'name' with the actual key for the subscription name in metadata
      description: subscription.plan.metadata.Description, // Replace 'description' with the actual key for the subscription description in metadata
    }));
    //console.log(subscriptionDetails);

    // Return the customer email and subscription details
    res.json({ email: customerEmail, subscriptions: subscriptionDetails });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching customer details." });
  }
};

module.exports.cancelSubscription = async (req, res) => {
  // Cancel the subscription
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.send({ subscription: deletedSubscription });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};

// module.exports.createCustomer = async (req, res) => {
//   // Create a new customer object
//   const customer = await stripe.customers.create({
//     email: req.body.email,
// });

//   // Save the customer.id in your database alongside your user.
//   // We're simulating authentication with a cookie.
//   res.cookie('customer', customer.id, { maxAge: 900000, httpOnly: true });
// }
