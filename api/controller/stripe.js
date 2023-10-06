const stripe = require("stripe")(
    "sk_test_51NxmblSEekr2cLoVvt2tnHgZZ8mjBusHbOOEYvHpQmnDQKoUBQYv5bA4yVXX1xpf0MM8qd31LqBRcnsBW72hSD7B004tFJqfSB"
  );
  
module.exports.create = async (req, res) => {
    const product = req.body;
    console.log(product);
  
    
    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.amount * 199, 
        },
        quantity: product.qnty, // Adjust the quantity as needed
      },
    ];
  
    // Create the Stripe Checkout Session using the line items array
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/`,
      cancel_url: `http://localhost:5173/sign-up`,
    });
  
    res.json({ id: session.id });
  };
  