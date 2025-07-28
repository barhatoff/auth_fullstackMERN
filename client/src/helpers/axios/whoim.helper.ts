import axiosHelper from "./axios.helper";
import { ErrorsType, User } from "../../types";

export const whoim = async (
  setError: React.Dispatch<React.SetStateAction<ErrorsType | null>>,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  if (!user) {
    const res: User = await axiosHelper("GET", "auth", setError);
    if (res) setUser(res);
  }
};
