import React from "react";
import './App.css';
import { BigNumber, ethers } from "ethers";
import abi from "./artifacts/contracts/EscrowService.sol/EscrowService.json";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import 'bootstrap/dist/css/bootstrap.min.css';


function configureContract() {
    const escrowAddress = "0x7356eBD9ae9b6FaFBF96B1F7AB97007e64daAC97";
    if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
    }
    window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(escrowAddress, abi.abi, signer);
    return contract;
}

export default function App() {
    const [disableSendPayment, setdisableSendPayment] = React.useState(false);
    const [disableClaimPayment, setdisableClaimPayment] = React.useState(true);
    const [disableConfirmDeliver, setdisableConfirmDeliver] = React.useState(true);
    const [disableDenyDelivery, setdisableDenyDelivery] = React.useState(true);
    const [disableAgentTransfer, setdisableAgentTransfer] = React.useState(true);
    const [vaultBalance, setvaultBalance] = React.useState();
    const [ethValue, setEthValue] = React.useState(60);
    const [isloading, setIsLoading] = React.useState(false);
    const [timer, setTimer] = React.useState();
    const id = React.useRef(null);
    const clear = () => {
        window.clearInterval(id.current);
    };

    React.useEffect(() => {
        id.current = window.setInterval(() => {
        setTimer((time) => time - 1);
        }, 1000);
        return () => clear();
    }, []);

    React.useEffect(async () => {
        if (timer === 0) {
            clear();
        }
        if(timer <= 0){
            setdisableSendPayment(true);
        }
            
    }, [timer]);

    React.useEffect(() => {
        const contract = configureContract();
        const locktimePromise = new Promise((resolve, reject) => {
            resolve(contract.lockTime());
        });
        const starttimePromise = new Promise((resolve, reject) => {
            resolve(contract.start());
        });
        const balPromise = new Promise((resolve, reject) => {
        resolve(contract.balance());
        });

        Promise.all([locktimePromise, starttimePromise, balPromise]).then(
        (values) => {
            setvaultBalance(Number(ethers.BigNumber.from(values[2]).toString()));
            setTimer(
                Number(ethers.BigNumber.from(values[1]).toString()) +
                Number(ethers.BigNumber.from(values[0]).toString()) -
                Math.floor(new Date().getTime() / 1000)
            );
        }
        );
    }, []);

    const handleSendPayment = async (e) => {
        e.preventDefault();
       
        const contract = configureContract();
        const myPromise = new Promise((resolve, reject) => {
            resolve(contract.SendPayment({ value: ethValue }));
        });
        myPromise.then(async () => {
            setdisableClaimPayment(false);
            setdisableSendPayment(true);
            alert("Transaction is submitted, Please wait for it be mined");
        });
        myPromise.catch((error) =>{
            alert(error.data.message);
        });
    };

    const handleClaimPayment = async (e) => {
        e.preventDefault();
      
        const contract = configureContract();
        contract.ClaimPayment().then((res) =>{
            console.log(res);
            setdisableClaimPayment(true);
            setdisableConfirmDeliver(false);
            setdisableDenyDelivery(false);
            alert("Transaction is submitted, Please wait for it be mined");
        })
        .catch((error) =>{
            alert(error.data.message);
        });
        
    };

    const handleConfirmDeliver = async (e) => {
        e.preventDefault();
    
        const contract = configureContract();
        contract.ConfirmDeliver().then(() =>{
            setdisableConfirmDeliver(true);
            setdisableDenyDelivery(true);
            setdisableAgentTransfer(false);
            alert("Transaction is submitted, Please wait for it be mined");
        })
        .catch((error) =>{
            alert(error.data.message);
        });
    };

    const handleDenyDeliver = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        contract.DenyDeliver().then((res) =>{
            console.log(res);
            setdisableConfirmDeliver(true);
            setdisableDenyDelivery(true);
            setdisableAgentTransfer(false);
            alert("Transaction is submitted, Please wait for it be mined");
        })
        .catch((error) =>{
            alert(error.data.message);
        });
    };

    const handleAgentTransfer = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        await contract.AgentTransfer();   
        alert("Transaction is submitted, Please wait for it be mined");
        //setvaultBalance(Number(ethers.BigNumber.from(await contract.balance()).toString()));
      }

    const handleStatus = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        contract.status().then((res) =>{
            alert("Transaction is submitted, Current Status is: "+res);
        })
        .catch((error) =>{
            alert(error.data.message);
        });
    };

    return (
        <div className="mx-auto" style={{"width": "200px"}}>            
                <div className="pad" >Time left : {timer} </div>
                <div className="pad" >Vault Balance: {vaultBalance}</div>
                <input
                    className="pad" 
                    id="ethValue"
                    type="text"
                    label="Deposit Amount"
                    onChange={(event) => setEthValue(event.target.value)}
                />
                <Button className="pad"  variant="dark"  onClick={handleSendPayment} disabled= {disableSendPayment}> Send Payment</Button>
                <Button className="pad"  variant="dark" onClick={handleClaimPayment} disabled= {disableClaimPayment}> Claim Payment</Button>
                <Button className="pad"  variant="dark" onClick={handleConfirmDeliver} disabled= {disableConfirmDeliver}> Confirm Deliver</Button>
                <Button className="pad"  variant="dark" onClick={handleDenyDeliver} disabled= {disableDenyDelivery}> Deny Deliver</Button>
                <Button className="pad"  variant="dark" onClick={handleAgentTransfer} disabled= {disableAgentTransfer}> Agent Transfer</Button>
                <Button className="pad"  variant="dark" onClick={handleStatus}> Get Status</Button>
        </div>
    );
}
