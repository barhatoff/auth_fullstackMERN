import { useState } from "react";
import { SetError } from "../../types";
import * as yup from "yup";
import axiosHelper from "../../helpers/axios/axios.helper";
import { MuiButton, MuiTextfield } from "../../ui/mui";

const emailSchema = yup.string().email().min(3).max(50).required();
const passwordSchema = yup.string().min(8).max(100).required();
const nicknameSchema = yup.string().min(3).max(50).required();
const avatarUrlSchema = yup.string().url().optional();

export default function Registration({ setError }: { setError: SetError }) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
    nickname: string | null;
    avatarUrl: string | null;
  }>({ email: "", password: "", nickname: "", avatarUrl: "" });

  const validator = async () => {
    const isEmail = await emailSchema.isValid(email);
    const isPassword = await passwordSchema.isValid(password);
    const isNickname = await nicknameSchema.isValid(nickname);
    const isAvatar = await avatarUrlSchema.isValid(avatarUrl);
    if (!isEmail)
      setErrors({
        ...errors,
        email: "Wrong email. Length must be 3-50",
      });
    else if (!isPassword)
      setErrors({ ...errors, password: "Length must be over 8" });
    else if (!isNickname)
      setErrors({ ...errors, nickname: "Length must be 3-50" });
    else if (!isAvatar) setErrors({ ...errors, avatarUrl: "Wrong URL" });
    else if (isEmail && isPassword && isNickname && isAvatar) return true;
    return false;
  };

  const post = async () => {
    const validatorResult = await validator();
    if (validatorResult) {
      const doc = { email, password, nickname, avatarUrl };
      const res = await axiosHelper("POST", "auth/register", setError, doc);
      if (res) window.location.href = "/";
    }
  };
  return (
    <div className="flex-center justify-center w-4 flex-column center p-relative">
      <MuiTextfield
        label="email"
        state={email}
        error={!!errors.email}
        helperText={errors.email}
        setState={setEmail}
        margin="0 0 2rem 0"
      />
      <MuiTextfield
        label="password"
        state={password}
        error={!!errors.password}
        helperText={errors.password}
        setState={setPassword}
        type="password"
        margin="0 0 2rem 0"
      />
      <MuiTextfield
        label="nickname"
        state={nickname}
        error={!!errors.nickname}
        helperText={errors.nickname}
        setState={setNickname}
        margin="0 0 2rem 0"
      />{" "}
      <MuiTextfield
        label="AvatarUrl"
        state={avatarUrl}
        error={!!errors.avatarUrl}
        helperText={errors.avatarUrl}
        setState={setAvatarUrl}
        type="password"
        margin="0 0 2rem 0"
      />
      <MuiButton title="create" event={post} />
    </div>
  );
}
