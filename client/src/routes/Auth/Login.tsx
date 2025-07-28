import { useState } from "react";
import { SetError, User } from "../../types";
import { MuiButton, MuiTextfield } from "../../ui/mui";
import axiosHelper from "../../helpers/axios/axios.helper";

export default function Login({
  setError,
  user,
}: {
  setError: SetError;
  user: User | null;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [alert, setAlert] = useState(false);

  const login = async () => {
    if (!email || !password) return setAlert(true);

    const res = await axiosHelper("POST", "auth/login", setError, {
      email,
      password,
    });
    if (res) window.location.href = "/";
  };

  if (user)
    setError({
      code: 404,
      message: "Already logined",
      instructions: "To home",
      linkTo: "/",
    });

  return (
    <div className="flex-center justify-center w-4 flex-column center p-relative">
      <MuiTextfield
        label="email"
        state={email}
        setState={setEmail}
        margin="0 0 2rem 0"
      />
      <MuiTextfield
        label="password"
        state={password}
        setState={setPassword}
        type="password"
        margin="0 0 2rem 0"
      />
      <MuiButton title="login" event={login} />
      <p
        className="mt-m cursor-pointer"
        onClick={() => (window.location.href = "/register")}
      >
        create account
      </p>
      <div
        className={
          alert
            ? "fc-al mt-m p-absolute flex-column text-center"
            : "display-none"
        }
        style={{ top: "15rem" }}
      >
        <span>
          Wrong email or password <br />
          Try again
        </span>
      </div>
    </div>
  );
}
