'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { signupEmail } from '../actions';
import FieldInfo from '../ui/form-filed-info';

export default function SignupForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      signupEmail(value);
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <>
      <h1>SignupForm</h1>
      <form>
        <div>
          <form.Field
            name="email"
            validators={{
              onChange: z.string().email(),
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: z.string().refine(
                async (value) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return !value.includes('error');
                },
                { message: "No 'error' allowed in email" }
              ),
            }}
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Email:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name="password"
            validators={{
              onChange: z.string().min(4),
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: z.string().refine(
                async (value) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return !value.includes('error');
                },
                { message: "No 'error' allowed in password" }
              ),
            }}
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>Password:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </>
  );
}
