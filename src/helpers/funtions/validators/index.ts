export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAadhar = (aadhar: string) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

export const validateDateOfBirth = (dob: string) => {
  if (!dob) return false;
  const today = new Date();
  const birthDate = new Date(dob);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 0;
  }
  return age >= 0 && birthDate <= today;
};

export const getErrorMessage = (errors: any[]): string | null => {
  if (!errors || errors.length === 0) return null;
  const error = errors[0];
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && error.message) {
    return error.message;
  }
  if (error && typeof error === "object" && error[0].message) {
    return error[0].message;
  }
  return "Validation error";
};
