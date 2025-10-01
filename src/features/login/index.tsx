import { HexagonBackground } from "@/components/animate-ui/backgrounds/hexagon";
import { Card, CardContent } from "@/components/ui/card";
import { v1LoginSendOtpCreateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import LoginForm from "./forms/LoginForm";
import OTPForm from "./forms/OTPForm";
import type { LoginFormStateType, LoginPayload } from "./types";

const initialState: LoginFormStateType = {
  phoneNumber: undefined,
  agreedToTerms: false,
  isLoading: false,
  otpSent: false,
  canResend: false,
};

export function LoginFeat() {
  const [state, setState] = useState<LoginFormStateType>(initialState);
  // const { isLoggedIn } = useUserStore();

  const sendOTP = useMutation({
    ...v1LoginSendOtpCreateMutation(),
    onSuccess: (data) => {
      toast.success(data.message);
      setState((prev) => ({
        ...prev,
        otpSent: true,
        phoneNumber: prev.phoneNumber,
        agreedToTerms: prev.agreedToTerms,
      }));
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to send OTP");
    },
    onSettled: () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    },
  });

  const handleSendOTP = ({ phoneNumber, agreedToTerms }: LoginPayload) => {
    if (!phoneNumber || !agreedToTerms) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      phoneNumber,
      agreedToTerms,
    }));

    sendOTP.mutate({
      body: { phone_number: String(phoneNumber) },
    });
  };

  const resetForm = () => {
    setState((prev) => ({ ...prev, otpSent: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <HexagonBackground className="absolute inset-0 flex items-center justify-center rounded-xl" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 z-50">
        <Card className="bg-white backdrop-blur-sm shadow-xl border-0 animate-in slide-in-from-bottom-4 duration-500 delay-200 py-0">
          <CardContent className="p-8 space-y-4">
            <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-center mb-3">
                <img src="/logo.png" alt="logo" height={60} width={60} />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to Lyfeboat
                </h1>
                <p className="text-base text-gray-600 -mt-1">
                  Login for a seamless experience
                </p>
              </div>
            </div>

            {!state.otpSent && (
              <LoginForm
                handleSendOTP={handleSendOTP}
                isLoading={state.isLoading}
              />
            )}

            {state.otpSent && <OTPForm resetForm={resetForm} data={state} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
