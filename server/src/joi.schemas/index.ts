import Joi from "joi";

export const joiSchemas = {
  user: Joi.object().keys({
    email: Joi.string().email().required().min(3).max(50),
    password: Joi.string().required().min(8).max(100),
    nickname: Joi.string().min(3).max(50).required(),
    avatarUrl: Joi.string().uri(),
  }),
  userPatch: Joi.object().keys({
    email: Joi.string().email().required().min(3).max(50),
    password: Joi.string().required().min(8).max(100),
    newEmail: Joi.string().email().min(3).max(50).allow(null).optional(),
    newPassword: Joi.string().min(8).max(100).allow(null).optional(),
  }),
  userProfile: Joi.object().keys({
    nickname: Joi.string().min(3).max(50).allow(null).optional(),
    avatarUrl: Joi.string().uri(),
  }),
};
