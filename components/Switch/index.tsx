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

export default function RadioGroup({ defaultValue = 'light', onChange }: IProps) {
    const handleChange = (val: string) => {
        onChange(val);
    }
    const options = ['light', 'dark'];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'light-mode',
        value: defaultValue,
        onChange: handleChange,
    })

    const group = getRootProps();

    return (
        <HStack {...group} className='bg-[#F3F3F0] dark:bg-cblack flex h-10 rounded-xl p-1'>
            {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                    <RadioCard key={value} {...radio}>
                        {value === 'light' ?
                            <div className='w-8 h-8 flex items-center justify-center'><SunIcon color={defaultValue === 'light' ? 'black' : 'white'} /></div>
                            : <div className='w-8 h-8 flex items-center justify-center'><MoonIcon color={defaultValue === 'light' ? 'black' : 'white'} /></div>}
                    </RadioCard>
                )
            })}
        </HStack>
    )
}