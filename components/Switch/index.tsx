import {
    HStack,
    useRadioGroup
} from '@chakra-ui/react';
import {
    SunIcon, MoonIcon,
} from '@chakra-ui/icons'
import RadioCard from './RadioCard';

interface IProps {
    defaultValue: string,
    onChange: Function,
}

export default function RadioGroup({
    defaultValue = 'light',
    onChange }: IProps) {

    console.log('defaultValue', defaultValue)

    const handleChange = (val: string) => {
        onChange(val);
    }
    const options = ['light', 'dark'];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'light-mode',
        defaultValue: defaultValue,
        onChange: handleChange,
    })

    const group = getRootProps();

    return (
        <HStack {...group} className='bg-[#F3F3F0] dark:bg-[#282A33] flex h-10 rounded-xl p-1'>
            {options.map((value) => {
                const radio = getRadioProps({ value })
                return (
                    <RadioCard key={value} {...radio}>
                        {value === 'light' ? <div className='w-8 h-8 flex items-center justify-center'><SunIcon /></div> : <div className='w-8 h-8 flex items-center justify-center'><MoonIcon /></div>}
                    </RadioCard>
                )
            })}
        </HStack>
    )
}