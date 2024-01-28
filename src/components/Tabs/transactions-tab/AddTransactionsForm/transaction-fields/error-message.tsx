import { Field, getIn } from "formik";

const ErrorMessage = ({ name }: any) => (
  <Field name={name}>
    {({ form }: any) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);

      return touch && error ? (
        <div style={{ color: "red" }}>Required</div>
      ) : null;
    }}
  </Field>
);

export default ErrorMessage;
