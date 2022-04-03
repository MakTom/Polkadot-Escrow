import React from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./artifacts/contracts/EscrowService.sol/EscrowService.json";
import Button from "react-bootstrap/Button";

import 'bootstrap/dist/css/bootstrap.min.css';

function configureContract() {
    const escrowAddress = "0x3E2B9B6F1c0952Cf5E4E45fBF63f00f54A563215";
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
    const [ethValue, setEthValue] = React.useState(0);
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
            const contract = configureContract();
            contract.status().then((currentStatus) =>{
                console.log(currentStatus);
                if(currentStatus > 1){
                    if(currentStatus === 2){
                        setdisableClaimPayment(true);
                        setdisableConfirmDeliver(false);
                        setdisableDenyDelivery(false);
                        setIsLoading(false);
                    } else if (currentStatus === 3){
                        setdisableConfirmDeliver(true);
                        setdisableDenyDelivery(true);
                        setdisableAgentTransfer(false);
                        setIsLoading(false);
                    }
                    else if (currentStatus === 4){
                        setdisableConfirmDeliver(true);
                        setdisableDenyDelivery(true);
                        setdisableAgentTransfer(false); 
                        setIsLoading(false);
                    }
                }
                else{
                    alert("Time has lapsed to send or claim payment, you will need to redeploy the contract");
                    clear();
                }
            })
            .catch((error) =>{
                alert(error.data.message);
            });
            
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
        alert("Transaction is submitted, Please wait for it be mined");
        setIsLoading(true);
        const tx = await contract.SendPayment({ value: ethValue});
        tx.wait().then(async()=>{
            console.log("Done");
            console.log(tx);
            setdisableClaimPayment(false);
            setdisableSendPayment(true);
            setvaultBalance(Number(ethers.BigNumber.from(await contract.balance()).toString()));
            setEthValue(0);
            setIsLoading(false);
        }).catch((error) =>{
            alert(error.data.message);
            setEthValue(0);
            setIsLoading(false);
        });
     }

    const handleClaimPayment = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        alert("Transaction is submitted, Please wait for it be mined");
        setIsLoading(true);
        const tx = await contract.ClaimPayment();
        console.log(tx);
        tx.wait().then(async () =>{
            console.log(tx);
            console.log("handleClaimPayment");
            setdisableClaimPayment(true);
            setdisableConfirmDeliver(false);
            setdisableDenyDelivery(false);
            setIsLoading(false);
        })
        .catch((error) =>{
            alert(error.data.message);
            setIsLoading(false);
        });
        
    };

    const handleConfirmDeliver = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        alert("Transaction is submitted, Please wait for it be mined");
        setIsLoading(true);
        const tx = await contract.ConfirmDeliver();
       
        tx.wait().then(() =>{
            setdisableConfirmDeliver(true);
            setdisableDenyDelivery(true);
            setdisableAgentTransfer(false);
            setIsLoading(false);
        })
        .catch((error) =>{
            alert(error.data.message);
            setIsLoading(false);
        });
    };

    const handleDenyDeliver = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        alert("Transaction is submitted, Please wait for it be mined");
        setIsLoading(true);
        const tx = await contract.DenyDeliver();
        
        tx.wait().then(() =>{
            setdisableConfirmDeliver(true);
            setdisableDenyDelivery(true);
            setdisableAgentTransfer(false); 
            setIsLoading(false);
        })
        .catch((error) =>{
            alert(error.data.message);
            setIsLoading(false);
        });
    };

    const handleAgentTransfer = async (e) => {
        e.preventDefault();
        const contract = configureContract();
        alert("Transaction is submitted, Please wait for it be mined");
        setIsLoading(true);
        const tx = await contract.AgentTransfer();  
        tx.wait().then(async () =>{
            setdisableAgentTransfer(true); 
            setvaultBalance(Number(ethers.BigNumber.from(await contract.balance()).toString()));
            setIsLoading(false);

        })
        .catch((error) =>{
            alert(error.data.message);
            setIsLoading(false);
        });
        
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
            {isloading &&
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>   
            }
            
            <div disabled = {isloading}>   
                <div className="pad" >Time left : {timer} </div>
                <div className="pad" >Vault Balance: {vaultBalance}</div>
                <input
                    className="pad" 
                    id="ethValue"
                    type="text"
                    value = {ethValue}
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
        </div>
    );
}
