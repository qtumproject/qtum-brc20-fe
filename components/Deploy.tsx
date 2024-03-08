import { useState, useEffect } from "react"
import { Address, Script, Signer, Tap, Tx } from '@cmdcode/tapscript';
import {
    Divider,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
} from '@chakra-ui/react'
import {
    textToHex,
    hexToBytes,
    bytesToHex,
    buf2hex,
    createQR,
    loopTilAddressReceivesMoney,
    waitSomeSeconds,
    addressReceivedMoneyInThisTx,
    pushBTCpmt,
    satsToQtum,
    p2trEncode,
} from '@/utils';
import FeeType from "./FeeType";
import PayModal from "./PayModal";

const feeTypeMap: { [k: string]: string } = { // TODO add interface 
    'economy': '742.74',
    'normal': '742.74',
    'custom': '742.74',
};

export default function Deploy() {
    const encodedAddressPrefix = 'tq'; // qc for qtum | tq for qtum_testnet

    const [step, setStep] = useState(1);

    const [tick, setTick] = useState('')
    const [amount, setAmount] = useState('21000000');
    const [limit, setLimit] = useState('1');
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState('normal');
    const [customFee, setCustomFee] = useState(feeTypeMap['custom']);
    const [fee, setFee] = useState('742.74');
    const [isModalShow, setIsModalShow] = useState(false);
    const [isTickError, setIsTickError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);
    const [isLimitError, setIsLimitError] = useState(false);
    const [isRAddressError, setisRAddressError] = useState(false);

    const [totalFees, setTotalFees] = useState(0);
    const [qrImg, setQrImg] = useState('');
    const [fundingAddress, setFundingAddress] = useState('');

    const [deploy, setDeploy] = useState({
        p: 'brc-20',
        op: 'deploy',
        tick: '',
        amt: '0',
    })

    useEffect(() => {
        setDeploy({
            p: 'brc-20',
            op: 'deploy',
            tick,
            amt: amount,
        })
    }, [tick, amount])

    useEffect(() => {
        setFee(feeTypeMap[feeType]);
    }, [feeType])

    const calcTotalFees = async (customFee: string, fee: string, mint: object) => {
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

    }

    useEffect(() => {
        calcTotalFees(customFee, fee, deploy);
    }, [customFee, fee, deploy])


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

    const handleSubmit = () => {
        const valid = validSecondForm();
        if (valid) {
            transfer();
            setIsModalShow(true);
        }
    }

    const transfer = async () => {
        let inscriptions = [];
        console.log('================transfer=================');

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
        let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
        let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, { target: init_leaf });
        console.log('init_tapkey', init_tapkey);
        console.log('init_cblock', init_cblock);


        const hex = textToHex(JSON.stringify(deploy));
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

        let inscriptionAddress = p2trEncode(tapkey, encodedAddressPrefix);

        console.log('Inscription address: ', inscriptionAddress);
        console.log('Tapkey:', tapkey);
        let prefix = 160;
        let txsize = prefix + Math.floor(data.length / 4);
        console.log("TXSIZE", txsize);
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


        let fundingAddress = p2trEncode(init_tapkey, encodedAddressPrefix);
        console.log('Funding address: ', fundingAddress, 'based on', init_tapkey);
        setFundingAddress(fundingAddress)

        console.log('Address that will receive the inscription:', rAddress);

        let qr_value = "qtum:" + fundingAddress + "?amount=" + satsToQtum(totalFees);
        console.log("qr:", qr_value);

        const qrimg = createQR(qr_value);
        setQrImg(qrimg as any);

        // 检查转账是否完成
        await loopTilAddressReceivesMoney(fundingAddress, true);
        await waitSomeSeconds(2);
        let txinfo = await addressReceivedMoneyInThisTx(fundingAddress);

        let txid = txinfo[0];
        let vout = txinfo[1];
        let amt = txinfo[2];

        console.log("yay! txid:", txid, "vout:", vout, "amount:", amt);

        // 开始转账到toaddress和inscription address
        let outputs = [];
        for (let i = 0; i < inscriptions.length; i++) {

            outputs.push(
                {
                    value: 546 + inscriptions[i].fee,
                    scriptPubKey: ['OP_1', inscriptions[i].tapkey]
                }
            );

        }

        const init_redeemtx = Tx.create({
            vin: [{
                txid: txid,
                vout: vout,
                prevout: {
                    value: amt,
                    scriptPubKey: ['OP_1', init_tapkey]
                },
            }],
            vout: outputs
        })

        const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, { extension: init_leaf });
        init_redeemtx.vin[0].witness = [init_sig.hex, init_script, init_cblock];

        console.dir(init_redeemtx, { depth: null });
        console.log('YOUR SECKEY', seckey);
        let rawtx = Tx.encode(init_redeemtx).hex;
        let _txid = await pushBTCpmt(rawtx);

        console.log('Init TX', _txid);

        const inscribe = async (inscription: any, vout: any) => {
            // we are running into an issue with 25 child transactions for unconfirmed parents.
            // so once the limit is reached, we wait for the parent tx to confirm.

            await loopTilAddressReceivesMoney(inscription.inscriptionAddress, true);
            await waitSomeSeconds(2);
            let txinfo2 = await addressReceivedMoneyInThisTx(inscription.inscriptionAddress);

            let txid2 = txinfo2[0];
            let amt2 = txinfo2[2] || 0;

            const redeemtx = Tx.create({
                vin: [{
                    txid: txid2,
                    vout: vout,
                    prevout: {
                        value: amt2,
                        scriptPubKey: ['OP_1', inscription.tapkey]
                    },
                }],
                vout: [{
                    value: amt2 - inscription.fee,
                    scriptPubKey: ['OP_1', Address.p2tr.decode(rAddress).hex]
                }],
            });

            const sig = await Signer.taproot.sign(seckey.raw, redeemtx, 0, { extension: inscription.leaf });
            redeemtx.vin[0].witness = [sig.hex, inscription.script_orig, inscription.cblock];

            console.dir(redeemtx, { depth: null });

            let rawtx2 = Tx.encode(redeemtx).hex;
            let _txid2;

            _txid2 = await pushBTCpmt(rawtx2) || '';

            if (_txid2.includes('descendant')) {
                inscribe(inscription, vout);
                return;
            }
        }

        for (let i = 0; i < inscriptions.length; i++) {

            inscribe(inscriptions[i], i);
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
                            <FormLabel htmlFor='amount'>Total Supply</FormLabel>
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
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isLimitError}>
                            <FormLabel htmlFor='limit'>Limit Per Mint</FormLabel>
                            <NumberInput id='limit' defaultValue={1} min={1} value={limit} onChange={(value) => setLimit(value)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {isLimitError && <FormErrorMessage>
                                invalid input limit
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='400px'
                            variant='brandPrimary'
                            type='submit'
                            onClick={() => { handleGoNext() }}
                        >
                            Next
                        </Button>
                    </div>

                </div >
            }
            {
                step === 2 && <div>
                    <div className='mb-4'>
                        <FormControl>
                            <pre className="py-[16px] rounded-[12px] pl-[16px] bg-[#F3F3F0] break-all whitespace-break-spaces">{JSON.stringify(deploy)} </pre>
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isRAddressError}>
                            <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                            <Input
                                id='raddress'
                                placeholder='input your receiving address'
                                value={rAddress}
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
                    </div>

                    <Divider className="mb-4" />
                    <div className="mb-4">
                        <div className="mb-4 flex justify-between">
                            <div className="">Network Fee</div>
                            <div>{totalFees} sats = {satsToQtum(totalFees)} QTUM</div>
                        </div>
                    </div>

                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='236px'
                            variant='outline'
                            className='mr-10'
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
                </div>
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