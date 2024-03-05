import {
  HStack,
  useRadioGroup
} from '@chakra-ui/react';
import RadioCard from './RadioCard';

interface IProps {
  onChange: Function,
}

export default function RadioGroup({ onChange }: IProps) {

  const options = ['Mint', 'Deploy']
  const handleChange = (val: string) => {
    onChange(val);
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'opType',
    defaultValue: 'Mint',
    onChange: handleChange,
  })

  const group = getRootProps()

  return (
    <HStack {...group} className='bg-[#F3F3F0] h-12 rounded-xl p-1.5'>
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