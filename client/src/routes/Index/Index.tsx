import { Skeleton } from "@mui/material";
import { SetError, User } from "../../types";
import { MuiButton } from "../../ui/mui";
import axiosHelper from "../../helpers/axios/axios.helper";

export default function Index({
  setError,
  user,
}: {
  setError: SetError;
  user: User | null;
}) {
  return (
    <div className="m-m d-flex w-12 justify-between">
      <div className="w-6">
        <div className="d-flex">
          {user?.profile?.avatarUrl ? (
            <img
              src={user.profile.avatarUrl}
              style={{ width: "10rem", height: "10rem", borderRadius: "100%" }}
            />
          ) : (
            <Skeleton variant="circular" width={"10rem"} height={"10rem"} />
          )}

          {user?.profile?.nickname ? (
            <div className="flex-row w-10 ml-s">
              <p>{user.profile.nickname}</p>
              <p>role: {user.role}</p>
            </div>
          ) : (
            <div className="flex-row w-10 ml-s">
              <Skeleton variant="rectangular" width={"80%"} height={"3rem"} />
              <Skeleton
                variant="rectangular"
                width={"50%"}
                height={"3rem"}
                className="mt-m"
              />
            </div>
          )}
        </div>
        <div className="mt-m">
          <h1>Hello! {user?.email}</h1>
        </div>
      </div>
      <div className="w-6 align-right d-flex justify-end">
        <MuiButton
          title="Logout"
          event={async () => {
            const res = await axiosHelper("GET", "auth/logout", setError);
            if (res) window.location.href = "/login";
          }}
        />
      </div>
    </div>
  );
}
