import { createContext, useState } from 'react';

interface CredentialsInterface {
  username: string;
  setUserName: (value: string) => void;
  loggedIn: boolean;
  setLoggedin: (value: boolean) => void;
}

export const CredentialsContext = createContext<CredentialsInterface>({} as CredentialsInterface);
export default function CredentialsProvider({children}: {children: React.ReactNode}) {
  const [loggedIn, setLoggedin] = useState(false);
  const [username, setUserName] = useState("");
  return (
    <CredentialsContext.Provider value={{loggedIn,setLoggedin,username,setUserName}}>
      {children}
    </CredentialsContext.Provider>
  );
}
