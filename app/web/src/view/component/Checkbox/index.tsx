export interface CheckboxProps {
  /** Button contents */
  label: string;
}

/** Primary UI component for user interaction */
export const Checkbox = ({
  label = "checkbox"
}: CheckboxProps) => {
  return (
    <div>
      <input type="checkbox" />
      <label>{label}</label>
    </div>
  );
};
