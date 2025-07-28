import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ErrorsType, User } from "./types";
import { whoim } from "./helpers/axios/whoim.helper";
import { Error, Index, Login, Registration } from "./routes";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<ErrorsType | null>(null);

  useEffect(() => {
    whoim(setError, user, setUser);
  }, []);

  return (
    <div className="container">
      <Error err={error} />
      <BrowserRouter>
        {error ? null : (
          <Routes>
            <Route
              path="/login"
              element={<Login setError={setError} user={user} />}
            />
            <Route
              path="/register"
              element={<Registration setError={setError} />}
            />
            <Route
              path="/"
              element={<Index setError={setError} user={user} />}
            />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}
