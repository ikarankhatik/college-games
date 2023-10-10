import React, { useState, useEffect } from "react";
import { Fetch } from "../helper/dbFetch";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {subscribed} from "../store/stripeSlice";
import { toast } from "react-toastify";

const SubscriptionPrice = () => {
  const [product, setProduct] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("pending"); // Track subscription status

  const dispatch = useDispatch();
  const isSubscribed = useSelector((state) => state.stripe.isSubscribed);
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch("http://localhost:4000/api/stripe/config");
      const productConfig = await response.json();
      setProduct(productConfig);
    };
    fetchProduct();
  }, []);

  const createSubscription = async () => {
    const path = "/api/stripe/create-subscription";
    const priceId = product.priceId;
    const data = { priceId };
    const { subscriptionId, clientSecret, success } = await Fetch(path, data);
   if(success === false){
    toast.info("Already subscribed")
   }else{
    setSubscriptionData({ subscriptionId, clientSecret });
    setSubscriptionStatus("created"); // Update the subscription status
   }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subscriptionStatus !== "created") {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      subscriptionData.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
          },
        },
      }
    );

    if (error) {
      setMessages(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setSubscriptionStatus("succeeded");
      dispatch(subscribed())
    }
  };

  if(isLoggedIn === false){
    toast.info("You must be logged in first");
    navigate("/")
  }



  return (
    <div className="min-h-screen  flex items-center justify-center">
      {product ? (
        <div className="bg-gray-200 w-[800px] p-8 rounded shadow-lg flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:mr-4">
            <img
              src={product.productImage}
              alt={product.productName}
              className="w-full h-[150px] object-cover rounded"
            />
          </div>
          <div className="lg:w-1/2 lg:ml-4">
            <h1 className="text-2xl font-semibold mb-4">
              {product.productName}
            </h1>
            <p className="text-gray-600 mb-4">{product.productDescription}</p>
            <p className="text-xl font-bold mb-4">
              &#x20b9;{product.productPrice}
            </p>

            {subscriptionStatus === "succeeded"  || isSubscribed === true ?  (
              <p>You are a subcriber.</p>              
            ) : (
              <div>
                {subscriptionStatus === "created" ? (
                  <form onSubmit={handleSubmit}>
                    <label>
                      Full name
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>

                    <CardElement />

                    <button className="bg-orange-500 m-6 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300">
                      Subscribe
                    </button>

                    <div>{messages}</div>
                  </form>
                ) : (
                  <button
                    onClick={createSubscription}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300"
                  >
                    Create Subscription
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading product information...</p>
      )}
    </div>
  );
};

export default SubscriptionPrice;
