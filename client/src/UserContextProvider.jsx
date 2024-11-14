import { createContext, useState } from "react";

// It's conventionally better to capitalize context name
const UserContext = createContext();

function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

// Named exports for both context and provider
export { UserContextProvider, UserContext };
