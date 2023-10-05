export async function Fetch(path, data) {
    try {      
      const endpoint = "http://localhost:4000";
      const response = await fetch(endpoint.concat(path), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",          
        },
        redirect: 'follow',
        credentials: 'include',
        body: JSON.stringify(
          data
        ),
      });
      console.log(response);
      const body = await response.text();     
      const result = JSON.parse(body);
      return result;
    } catch (e) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    } 
  }


  export async function Get(query) {
    const endpoint = "http://localhost:4000";   
    const res = await fetch(endpoint + query, {
      method: "GET",
      credentials: 'include', // Include cookies in the request
    });
    
    if (!res) {
      console.error(`Request failed with status ${res.status}`);
      return null; // Or throw an error if you prefer
    }
  
    const body = await res.text();
  
    try {
      const response = JSON.parse(body);
      return response;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // Or throw an error if you prefer
    }
  }
  

  export async function Delete(path) {
    try {
      const endpoint = "http://localhost:4000";
      const response = await fetch(endpoint.concat(path), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await response.text();
      const result = JSON.parse(body);
      return result;
    } catch (e) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }
  }

  export async function Update(path, data) {
    try {
      const endpoint = "http://localhost:4000";
      const response = await fetch(endpoint.concat(path), {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const body = await response.text();
      const result = JSON.parse(body);
      return result;
    } catch (e) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }
  }
  
  