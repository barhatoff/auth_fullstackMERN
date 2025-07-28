export type ErrorsType = {
  code: number | string | undefined;
  message: string;
  instructions?: string;
  linkTo?: string;
  details?: any;
};
export type SetError = React.Dispatch<React.SetStateAction<ErrorsType | null>>;

//
export type User = {
  _id: string;
  email: string;
  role: string;
  profile?: { nickname?: string; avatarUrl?: string };
};

// UI

export type SnackbarType = {
  message: string;
  color?: string;
  trigger: boolean;
};
