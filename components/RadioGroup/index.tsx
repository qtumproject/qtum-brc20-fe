import {
  HStack,
  useRadioGroup
} from '@chakra-ui/react';
import RadioCard from './RadioCard';

interface IProps {
  options: string[],
  defaultValue: string,
  name: string,
  onChange: Function,
}

export default function RadioGroup({
  options,
  name = 'opType',
  defaultValue = '',
  onChange }: IProps) {

  const handleChange = (val: string) => {
    onChange(val);
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: name,
    defaultValue: defaultValue,
    onChange: handleChange,
  })

  const group = getRootProps()

  return (
    <HStack {...group} className='bg-[#F3F3F0] dark:bg-[#282A33] flex h-12 rounded-xl p-1.5'>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}