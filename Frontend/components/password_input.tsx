import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  label?: string;
}

function PasswordInput({ className, label, ...props }: PasswordInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="mb-4">
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute -top-2.5 left-4 bg-white px-2 text-xs font-normal z-10 transition-colors",
              isFocused ? "text-sky-400" : "text-gray-400"
            )}
          >
            {label}
          </label>
        )}
        <input
          type={showPassword ? "text" : "password"}
          data-slot="input"
          className={cn(
            "h-14 w-[28rem] rounded-xs border border-gray-200 bg-transparent py-3 text-base outline-none transition-all",
            "placeholder:text-gray-300",
            "focus:border-sky-400 focus:ring-1 focus:ring-sky-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "pl-4 pr-12",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export { PasswordInput };
