import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formatTime } from "@/helpers/funtions/formatTime";
import {
  v1LoginResendOtpCreateMutation,
  v1LoginVerifyOtpCreateMutation,
} from "@/services/api/gen/@tanstack/react-query.gen";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { OTPFormProps, OTPFormStateI } from "../types";

const initialState: OTPFormStateI = {
  timer: 120,
  canResend: false,
  loading: null,
};

const OTPForm: React.FC<OTPFormProps> = ({ resetForm, data }) => {
  const [state, setState] = useState<OTPFormStateI>(initialState);
  const navigate = useNavigate();
  const router = useRouter();
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore } = context;

  const verifyOTP = useMutation({
    ...v1LoginVerifyOtpCreateMutation(),
    onSuccess: () => {
      toast.success("Logged in successfully");
      useUserStore.setState({
        initialized: false,
      });
      navigate({ to: "/" });
      router.invalidate();
    },
  });

  const resendOTP = useMutation({
    ...v1LoginResendOtpCreateMutation(),
    onSuccess: (data) => {
      setState((prev) => ({ ...prev, timer: 120, canResend: false }));
      toast.success(data?.message ?? "OTP resent");
    },
  });

  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        setState((prev) => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setState((prev) => ({ ...prev, canResend: true }));
    }
  }, [state.timer]);

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: async ({ value }) => {
      verifyOTP.mutate({
        body: {
          phone_number: String(data.phoneNumber),
          otp: value.otp,
        },
      });
    },
  });

  const handleResendOTP = async () => {
    if (!state.canResend) return;

    resendOTP.mutate({
      body: {
        phone_number: String(data.phoneNumber),
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="flex justify-center items-center !pb-0">
        <form.Field
          name="otp"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "OTP is required";
              if (value.length !== 6) return "OTP must be 6 digits";
              if (!/^\d+$/.test(value)) return "OTP must contain only numbers";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col">
              <InputOTP
                maxLength={6}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <div className="min-h-[1.25rem] mt-1 text-center text-sm">
                {field.state.meta.errors?.length ? (
                  <span className="text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed text-center pb-2 -mt-1">
        Enter your one-time password.
      </p>

      <div className="text-center space-y-2 px-14">
        <Button
          type="submit"
          disabled={form.state.isSubmitting || !form.state.canSubmit}
          className="w-full"
        >
          {form.state.isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="flex justify-between md:px-3 items-center">
          <p className="text-sm">
            {state.timer > 0 ? formatTime(state.timer) : "00 : 00"}
          </p>

          <Button
            type="button"
            className="text-sm text-left"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={!state.canResend || form.state.isSubmitting}
          >
            Resend
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button
          type="button"
          className="h-7 text-lg"
          variant="link"
          onClick={resetForm}
        >
          <ArrowLeft />
          Go Back
        </Button>
      </div>
    </form>
  );
};

export default OTPForm;
