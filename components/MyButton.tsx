import { useState } from "react";
import { Button } from "@chakra-ui/react"


export default function MyButton() {
    const [count, setCount] = useState(0);
    const btnClick = (): void => {
        setCount((count) => count + 1)
    }
    return (
        <div>
            <Button>click me</Button>
        </div >

    );
}