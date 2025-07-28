import { constant } from "../../constants/constant";
import { ErrorsType } from "../../types";

const errorsEnum: ErrorsType[] = [
  {
    code: "ERR_NETWORK",
    instructions: "Refresh page or try again later",
    message: "Problems on our side",
  },
  {
    code: 401,
    message: "Unathorized. Access denied!",
    instructions: "authorize!",
    linkTo: constant.APP_DOMEN + "/login",
  },
  {
    code: 403,
    message: "Forbidden",
    instructions: "To main page",
    linkTo: constant.APP_DOMEN + "/",
  },
];

export default function Error({ err }: { err: ErrorsType | null }) {
  if (!err) return null;

  let mutualError = { ...err };
  errorsEnum.forEach((error) => {
    if (error.code == err.code) {
      mutualError = { ...mutualError, ...error };
    }
  });

  return (
    <div className="w-12 pt-l pl-l">
      <h1 className="fc-al">Error {":("}</h1>
      <h2 className="mt-xl mb-xs">{mutualError.message}</h2>
      {mutualError.details ? <p>{mutualError.details.message}</p> : null}
      <p className="mt-xl">Errors code:</p>
      <h2 className="fc-al mt-xs mb-xl">{mutualError.code}</h2>
      <a href={mutualError?.linkTo}>
        <p>{mutualError?.instructions}</p>
      </a>
    </div>
  );
}
