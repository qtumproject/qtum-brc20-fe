interface IProps {
    text: string,
}

export default function PlaceHolder({ text }: IProps) {
    return <div className="flex items-center justify-center font-bold h-96">
        {text}
    </div>
}