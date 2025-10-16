export type LoginFormStateType = {
  phoneNumber: number | undefined;
  agreedToTerms: boolean;
  isLoading: boolean;
  otpSent: boolean;
  canResend: boolean;
};

export type OTPFormProps = {
  resetForm: () => void;
  data: LoginFormStateType;
};

export interface OTPFormStateI {
  timer: number;
  canResend: boolean;
  loading: number | null;
}

export type LoginPayload = Pick<
  LoginFormStateType,
  "phoneNumber" | "agreedToTerms"
>;
