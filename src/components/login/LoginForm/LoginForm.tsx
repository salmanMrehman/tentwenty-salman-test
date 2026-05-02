import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Button } from "@components/common/Button/Button";
import { Input } from "@components/common/Input/Input";
import { Checkbox } from "@components/common/Checkbox/Checkbox";
import { APP_STRINGS } from "@constants/strings";
import { ROUTES } from "@constants/routes";
import { hasErrors, validateLogin } from "@helpers/validation";
import { LoginFormErrors } from "@types-app/auth.types";
import styles from "./LoginForm.module.css";

/**
 * Login form.
 *
 * Validation runs locally on submit so the user sees field-level errors
 * before any network call. On a successful credentials sign-in, the
 * router is pushed to the dashboard (or the `callbackUrl` if any).
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateLogin(email, password);
    setErrors(v);
    if (hasErrors(v)) return;

    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setErrors({ form: APP_STRINGS.login.invalidCredentials });
        return;
      }

      const callbackUrl =
        typeof router.query.callbackUrl === "string"
          ? router.query.callbackUrl
          : ROUTES.dashboard;
      router.push(callbackUrl);
    } catch {
      setErrors({ form: APP_STRINGS.errors.generic });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Sign in"
    >
      <h1 className={styles.title}>{APP_STRINGS.login.welcome}</h1>

      {errors.form ? (
        <div className={styles.formError} role="alert">
          {errors.form}
        </div>
      ) : null}

      <Input
        label={APP_STRINGS.login.emailLabel}
        type="email"
        name="email"
        autoComplete="email"
        placeholder={APP_STRINGS.login.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />

      <Input
        label={APP_STRINGS.login.passwordLabel}
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={APP_STRINGS.login.passwordPlaceholder}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />

      <Checkbox
        label={APP_STRINGS.login.rememberMe}
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      />

      <Button type="submit" fullWidth isLoading={submitting}>
        {submitting ? APP_STRINGS.login.submitting : APP_STRINGS.login.submit}
      </Button>
    </form>
  );
}
