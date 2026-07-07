import LCFieldWrapper from './lcfieldwrapper' 
import SelectField from 'src/@core/components/form/Select'

interface Option {
  label: string
  value: string
}

interface Props {
  name: string
  label: string
  control: any
  options: Option[]
  placeholder?: string
    disableWrapper?: boolean   // <- this must exist

}

const LCSelectBox = ({ name, label, control, options, placeholder,  disableWrapper = false      // <- this must exist
 }: Props) => {
  return (
    <LCFieldWrapper>
      <SelectField
        name={name}
        label={label}
        control={control}
        options={options}
        placeholder={placeholder}
      />
    </LCFieldWrapper>
  )
}

export default LCSelectBox