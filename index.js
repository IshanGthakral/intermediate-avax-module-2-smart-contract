import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transferTo, setTransferTo] = useState(undefined);
  const [transferOwnershipTo, settransferOwnershipTo] = useState(undefined);

  const contractAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(10);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(10);
      await tx.wait()
      getBalance();
    }
  }

  const increaseBalance = async() => {
    if (atm) {
      let tx = await atm.increaseBalance(10);
      await tx.wait()
      getBalance();
    }
  }

  const decreaseBalance = async() => {
    if (atm) {
      let tx = await atm.decreaseBalance(10);
      await tx.wait()
      getBalance();
    }
  }
  const getOwner = async() => {
    if (atm) {
      atm.getOwner();
      
      
    }
  }

  const transfer = async () => {
    if (atm) {
      let tx = await atm.transfer(transferTo,10);
      await tx.wait()
      getBalance();
    }
  };

  const transferOwnership = async () => {
    if (atm) {
      let tx = await atm.transferOwnership(transferOwnershipTo);
      await tx.wait()
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit  ETH</button>
        <div>
        <button onClick={withdraw}>Withdraw  ETH</button>
        </div>
        <div>
        <button onClick={increaseBalance}>increaseBalance  ETH</button>
        </div>
        <div>
        <button onClick={decreaseBalance}>decreaseBalance  ETH</button>
        </div>
        <div>
        <button onClick={getOwner}> get Owner</button>
        </div>
        <div>
        <label htmlFor="transferTo">Transfer To:</label>
        <input
          type="text"
          id="transferTo"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />
        <button onClick={transfer}>Transfer1 ETH</button>
      </div>
      <div>
        <label htmlFor="transferOwnershipTo">transferOwnershipTo:</label>
        <input
          type="text"
          id="transferOwnershipTo"
          value={transferOwnershipTo}
          onChange={(e) => settransferOwnershipTo(e.target.value)}
        />
        <button onClick={transferOwnership}>transferOwnershipTo</button>
      </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the ISHAN Metacrafters ATM!(for easy transaction)</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
