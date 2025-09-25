import { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let [isLoading, setIsLoading] = useState(true);
  let { serverUrl } = useContext(authDataContext);
  
  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
        withCredentials: true,
      });
      
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }

  const logout = async () => {
    try {
      // Call server logout endpoint to clear the cookie
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      
      // Clear user data from context
      setUserData(null);
      
      // Clear any cached data or local storage if used
      localStorage.removeItem("userData");
      sessionStorage.removeItem("userData");
      
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  let value = { 
    userData, 
    setUserData, 
    serverUrl, 
    getCurrentUser, 
    logout,
    isLoading 
  };
  
  return ( 
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;