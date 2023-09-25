export async function Fetch(path, data) {
    try {      
      const endpoint = "http://localhost:4000";
      const response = await fetch(endpoint.concat(path), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",          
        },
        body: JSON.stringify({
          data,
        }),
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


  export async function Get(query) {
    const endpoint = "http://localhost:4000";   
    const res = await fetch(endpoint + query);
    //console.log("response show data " ,res);
    const body = await res.text();    
    const response = JSON.parse(body);
    //console.log("Body response text",response);
    return response;
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
  
  