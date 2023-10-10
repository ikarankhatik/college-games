import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Get } from '../helper/dbFetch';

const SubscriberAccount = () => {
  const [customerDetail, setCustomerDetail] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const path = "/api/stripe/customer-detail"
      const data = await Get(path);
      setCustomerDetail(data);
    };
    fetchData();
  }, []);

  if (!customerDetail) {
    return '';
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4">Account Detail</h1>


      <h2 className="text-xl font-semibold mt-8 mb-4">Subscriptions</h2>

      <div id="subscriptions">
        
      </div>
    </div>
  );
};

export default SubscriberAccount;
