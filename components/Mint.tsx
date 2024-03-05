import { useState, useEffect } from "react"
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Divider,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
} from '@chakra-ui/react'
import FeeType from "./FeeType";
import PayModal from "./PayModal";

const feeTypeMap: { [k: string]: string } = {
    'economy': '28',
    'normal': '30',
    'custom': '32',
}

interface IProps {
    bitcoinPrice: number,
}

export default function Mint({ bitcoinPrice }: IProps) {

    const encodedAddressPrefix = 'main';// TODO replace qtum
    const [step, setStep] = useState(1);

    const [tick, setTick] = useState('')
    const [amount, setAmount] = useState("1");
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState('normal');
    const [customFee, setCustomFee] = useState(feeTypeMap['custom']);
    const [fee, setFee] = useState('29');
    const [totalFees, setTotalFees] = useState(0);
    const [totalDollarFees, setTotalDollarFees] = useState(0);
    const [isModalShow, setIsModalShow] = useState(false);

    const [isTickError, setIsTickError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);
    const [isRAddressError, setisRAddressError] = useState(false);

    const [qrImg, setQrImg] = useState('');
    const [fundingAddress, setFundingAddress] = useState('');

    const [mint, setMint] = useState({
        p: 'brc-20',
        op: 'mint',
        tick: '',
        amt: '0',
    })

    useEffect(() => {
        setMint({
            p: 'brc-20',
            op: 'mint',
            tick,
            amt: amount,
        })
    }, [tick, amount])


    useEffect(() => {
        setFee(feeTypeMap[feeType]);
    }, [feeType])

    async function getTotalFee(totalFees: number, bitcoinPrice: number) {
        const dollarFee = await satsToDollars(totalFees, bitcoinPrice);
        console.log('dollarFee change', dollarFee)
        setTotalDollarFees(dollarFee);
    }

    const calcTotalFees = async (customFee: string, fee: string, mint: object, bitcoinPrice: number) => {
        console.log('===============')
        let totalFee = 0;
        let totalFees = 0;
        if (mint && fee) {
            const hex = textToHex(JSON.stringify(mint));
            const data = hexToBytes(hex);
            let prefix = 160;
            let txsize = prefix + Math.floor(data.length / 4);
            if (feeType === 'custom') {
                fee = customFee;
            }
            let feeTemp = Number(fee) * txsize;
            totalFee += feeTemp;

            let baseSize = 160;
            let padding = 546;
            let repeat = 1;
            totalFees += totalFee + ((69 + (repeat + 1) * 2) * 31 + 10) * Number(fee);
            totalFees += baseSize * repeat;
            totalFees += padding * repeat;
        }

        setTotalFees(totalFees);
        const dollarFee = await satsToDollars(totalFee, bitcoinPrice);
        setTotalDollarFees(Number(Number(dollarFee).toFixed(2)));

    }

    useEffect(() => {
        calcTotalFees(customFee, fee, mint, bitcoinPrice);
    }, [customFee, fee, mint, bitcoinPrice])

    const validForm = () => {
        let valid = true;
        if (!tick) {
            setIsTickError(true);
            valid = false;
        } else {
            setIsTickError(false);
        }
        if (!amount) {
            setIsAmountError(true);
            valid = false;
        } else {
            setIsAmountError(false);
        }
        return valid;
    }

    const handleGoNext = () => {
        const res = validForm();
        if (res) {
            setStep(2);
        }
    }

    const validSecondForm = () => {
        let valid = true;
        if (!rAddress) {
            setisRAddressError(true);
            valid = false;
        }
        return valid;
    }

    async function satsToDollars(sats: number, bitcoinPrice: number) {
        if (sats >= 100000000) sats = sats * 10;
        let bitcoin_price = bitcoinPrice;
        console.log('mint comp bitcoinprice is', bitcoinPrice)
        let value_in_dollars = Number(String(sats).padStart(8, "0").slice(0, -9) + "." + String(sats).padStart(8, "0").slice(-9)) * bitcoin_price;
        return value_in_dollars;
    }

    function buf2hex(buffer: any) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    function bytesToHex(bytes: any) {
        return bytes.reduce((str: any, byte: any) => str + byte.toString(16).padStart(2, "0"), "");
    }

    function textToHex(text: any) {
        var encoder = new TextEncoder().encode(text);
        return [...new Uint8Array(encoder)]
            .map(x => x.toString(16).padStart(2, "0"))
            .join("");
    }


    function hexToBytes(hex: any) {
        return Uint8Array.from(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
    }

    function satsToBitcoin(sats: any) {
        if (sats >= 100000000) sats = sats * 10;
        let string = String(sats).padStart(8, "0").slice(0, -9) + "." + String(sats).padStart(8, "0").slice(-9);
        if (string.substring(0, 1) == ".") string = "0" + string;
        return string;
    }

    function createQR(content: any) {
        let dataUriPngImage = document.createElement("img"),
            s = (window as any).QRCode.generatePNG(content, {
                ecclevel: "M",
                format: "html",
                fillcolor: "#FFFFFF",
                textcolor: "#000000",
                margin: 4,
                modulesize: 8,
            });
        dataUriPngImage.src = s;
        dataUriPngImage.id = "qr_code";
        return dataUriPngImage;
    }

    const transfer = async () => {
        let total_fee = 0;
        let inscriptions = [];
        console.log('================transfer=================');
        const { Address, Script, Signer, Tap, Tx } = (window as any).tapscript

        let privkey = bytesToHex((window as any).cryptoUtils.Noble.utils.randomPrivateKey());
        console.log('privkey', privkey);

        const KeyPair = (window as any).cryptoUtils.KeyPair;



        let seckey = new KeyPair(privkey);
        let pubkey = seckey.pub.rawX;

        const ec = new TextEncoder();

        const init_script = [
            pubkey,
            'OP_CHECKSIG'
        ];

        const init_script_backup = [
            '0x' + buf2hex(pubkey.buffer),
            'OP_CHECKSIG'
        ];

        let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
        let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, { target: init_leaf });
        console.log('init_tapkey', init_tapkey);
        console.log('init_cblock', init_cblock);


        const hex = textToHex(JSON.stringify(mint));
        const data = hexToBytes(hex);
        const mimetype = ec.encode("text/plain;charset=utf-8");
        const script = [
            pubkey,
            'OP_CHECKSIG',
            'OP_0',
            'OP_IF',
            ec.encode('ord'),
            '01',
            mimetype,
            'OP_0',
            data,
            'OP_ENDIF'
        ];

        const script_backup = [
            '0x' + buf2hex(pubkey.buffer),
            'OP_CHECKSIG',
            'OP_0',
            'OP_IF',
            '0x' + buf2hex(ec.encode('ord')),
            '01',
            '0x' + buf2hex(mimetype),
            'OP_0',
            '0x' + buf2hex(data),
            'OP_ENDIF'
        ];

        const leaf = await Tap.tree.getLeaf(Script.encode(script));
        const [tapkey, cblock] = await Tap.getPubKey(pubkey, { target: leaf });

        let inscriptionAddress = Address.p2tr.encode(tapkey, encodedAddressPrefix);

        console.log('Inscription address: ', inscriptionAddress);
        console.log('Tapkey:', tapkey);
        let prefix = 160;
        let txsize = prefix + Math.floor(data.length / 4);

        console.log("TXSIZE", txsize);

        let feeTemp = Number(fee) * txsize;
        total_fee += feeTemp;
        inscriptions.push(
            {
                leaf: leaf,
                tapkey: tapkey,
                cblock: cblock,
                inscriptionAddress: inscriptionAddress,
                txsize: txsize,
                fee: fee,
                script: script_backup,
                script_orig: script
            }
        );


        let fundingAddress = Address.p2tr.encode(init_tapkey, encodedAddressPrefix);
        console.log('Funding address: ', fundingAddress, 'based on', init_tapkey);
        setFundingAddress(fundingAddress)

        console.log('Address that will receive the inscription:', rAddress);

        const total_fees = total_fee;

        setTotalFees(total_fees)

        let qr_value = "bitcoin:" + fundingAddress + "?amount=" + satsToBitcoin(total_fees);
        console.log("qr:", qr_value);

        const qrimg = createQR(qr_value);
        setQrImg(qrimg as any);

    }

    const handleSubmit = () => {
        const valid = validSecondForm();
        if (valid) {
            transfer();
            setIsModalShow(true);
        }
    }

    return (
        <>
            {
                step === 1 && <div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isTickError}>
                            <FormLabel htmlFor='tick'>Tick</FormLabel>
                            <Input
                                id='tick'
                                placeholder='4 characters like &quot;abcd&quot;...'
                                value={tick}
                                onChange={(e) => setTick(e.target.value)} />
                            {isTickError && <FormErrorMessage>
                                invalid input tick name
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isAmountError}>
                            <FormLabel htmlFor='amount'>Amount</FormLabel>
                            <NumberInput id='amount' defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {isAmountError && <FormErrorMessage>
                                invalid input amount
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='400px'
                            type="submit"
                            variant='brandPrimary'
                            onClick={() => { handleGoNext() }}
                        >
                            Next
                        </Button>
                    </div>

                </div>
            }
            {
                step === 2 && <div>
                    <div className='mb-4'>
                        <FormControl>
                            <pre className="py-[16px] rounded-[12px] pl-[16px] bg-[#F3F3F0] break-all whitespace-break-spaces">{JSON.stringify(mint)} </pre>
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isRAddressError}>
                            <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                            <Input
                                id='raddress'
                                placeholder='input your receiving address'
                                value={rAddress}
                                variant='outline'
                                onChange={(e) => setRAddress(e.target.value)} />
                            {isRAddressError && <FormErrorMessage>invalid receive address</FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl>
                            <FormLabel htmlFor='amount'>Network Fee</FormLabel>
                            <div className="mb-4 flex justify-between">
                                <div><FeeType type="Economy" amount={Number(feeTypeMap['economy'])} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                                <div><FeeType type="Normal" amount={Number(feeTypeMap['normal'])} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                                <div><FeeType type="Custom" amount={Number(customFee)} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                            </div>
                            {
                                feeType === 'custom' && <div className="mb-4 flex">
                                    <Slider className="flex-auto" aria-label='slider-ex-1' focusThumbOnChange={false} value={Number(customFee)} onChange={(val) => setCustomFee(val.toString())}>
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                    <div className="w-24 ml-4">
                                        <NumberInput defaultValue={1} min={1} value={customFee} onChange={(value) => setCustomFee(value)}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </div>

                                </div>
                            }

                        </FormControl>
                    </div >
                    <Divider className="mb-4" />
                    <div className="mb-4">
                        <div className="mb-4 flex justify-between bg-[#F3F3F0] p-4 rounded-[12px]">
                            <div className="">Network Fee</div>
                            <div>{totalFees} sats = ${totalDollarFees}</div>
                        </div>
                    </div>

                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='236px'
                            colorScheme='brandPrimary'
                            variant='outline'
                            className='mr-8'
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            mt={4}
                            width='236px'
                            variant='brandPrimary'
                            onClick={() => handleSubmit()}
                        >
                            Submit&Pay
                        </Button>
                    </div>
                </div >
            }


            <PayModal
                isShow={isModalShow}
                fundingAddress={fundingAddress}
                totalPay={totalFees}
                close={() => setIsModalShow(false)}>
                {qrImg}
            </PayModal>

        </>
    )
}