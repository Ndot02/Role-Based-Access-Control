import yup from "yup"

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
// - min 8 chars
// - at least one letter
// - at least one digit OR one symbol

const registerSchema = yup.object({
  name: yup.string().trim().min(2).max(60).required(),
  email: yup.string().email().required(),
  password: yup.string().matches(passwordRegex, "Password must be minimum 8 characters and include letters and at least a number or symbol").required(),
  role: yup.string().oneOf(["Admin", "User"])
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export {registerSchema,loginSchema}