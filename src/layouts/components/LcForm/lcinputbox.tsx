import Field from 'src/@core/components/form/InputField'
import LCFieldWrapper from './lcfieldwrapper'

interface Props {
  control: any
  name: string
  label?: string
  placeholder?: string
  type?: 'text' | 'text-area' | 'number' | 'password'
  disableWrapper?: boolean
}

const LCInputBox = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  disableWrapper = false
}: Props) => {
  const input = (
    <Field
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      type={type}
    />
  )

  return disableWrapper ? input : <LCFieldWrapper>{input}</LCFieldWrapper>
}

export default LCInputBox