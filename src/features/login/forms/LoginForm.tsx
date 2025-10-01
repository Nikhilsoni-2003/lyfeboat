import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { z } from "zod";

const loginSchema = z.object({
  phoneNumber: z
    .number()
    .int()
    .refine(
      (val) => val.toString().length === 10,
      "Phone number must be 10 digits"
    ),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to terms and conditions"),
});

type LoginFormProps = {
  isLoading: boolean;
  handleSendOTP: (data: {
    phoneNumber: number;
    agreedToTerms: boolean;
  }) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ isLoading, handleSendOTP }) => {
  const form = useForm({
    defaultValues: {
      phoneNumber: 0,
      agreedToTerms: false,
    },
    onSubmit: async ({ value }) => {
      handleSendOTP(value);
    },
    validators: {
      onChange: loginSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <form.Field name="phoneNumber">
          {(field) => (
            <>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <span className="text-gray-600 font-medium text-lg border-r border-gray-300 pr-3 mr-3">
                    +91
                  </span>
                </div>
                <Input
                  type="tel"
                  placeholder="Enter Mobile Number*"
                  value={
                    field.state.value === 0 ? "" : field.state.value.toString()
                  }
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    field.handleChange(val ? Number(val) : 0);
                  }}
                  onBlur={field.handleBlur}
                  className={`pl-20 h-12 text-lg rounded-xl border-2 transition-all duration-200 bg-blue/50 ${
                    field.state.meta.errors.length > 0
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  maxLength={10}
                />
              </div>
              {field.state.meta.errors[0] && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {typeof field.state.meta.errors[0] === "string"
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message}
                </div>
              )}
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-1">
        <form.Field
          name="agreedToTerms"
          validators={{
            onChange: ({ value }) => (!value ? true : undefined),
          }}
        >
          {(field) => (
            <>
              <div className="flex items-start space-x-2 justify-center">
                <Checkbox
                  id="terms"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as boolean)
                  }
                  className={`mt-1 ${
                    field.state.meta.errors.length > 0
                      ? "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      : "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  }`}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  I Agree to{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {field.state.meta.errors[0] === true && (
                <div className=" text-red-500 text-center text-sm">
                  You must accept the terms and conditions
                </div>
              )}
            </>
          )}
        </form.Field>

        <div className="text-center">
          <Link
            to="/privacy"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            T&C's Privacy Policy
          </Link>
        </div>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending OTP...</span>
              </div>
            ) : (
              "Login with OTP"
            )}
          </Button>
        )}
      </form.Subscribe>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or Login Using</span>
        </div>
      </div> */}

      {/* <Button
        type="button"
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full h-12 text-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md bg-transparent"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700">Google</span>
        </div>
      </Button> */}

      <div className="flex justify-between md:px-2">
        <Link
          className="text-gray-500 underline hover:text-gray-700 text-base font-medium transition-colors duration-200"
          to="/signup"
        >
          New business ?
        </Link>
        <Link
          className="text-gray-500 underline hover:text-gray-700 text-base font-medium transition-colors duration-200"
          to="/"
        >
          Continue as guest
        </Link>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="text-gray-700 underline hover:text-gray-800 text-lg font-medium transition-colors duration-200"
        >
          Home
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
