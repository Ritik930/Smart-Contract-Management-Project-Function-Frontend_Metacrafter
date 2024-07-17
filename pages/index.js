import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
    // State variables
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
 // Contract address and ABI
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;
  // Function to retrieve the Metamask wallet object
  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }
  // Function to handle the connected Ethereum account

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }
// Function to connect the user's Metamask wallet
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
// Function to get the user's balance from the ATM contract
  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

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
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters Crypto Portal!</h1>
        <p><b>Here, Ritik Kumar</b></p>
      </header>
      {initUser()}
      <section className="info">
        <h2>About This Portal</h2>
        <p>This decentralized portal allows you to deposit and withdraw ETH using your MetaMask wallet.</p>
        <p>Connect your MetaMask wallet to get started and manage your funds securely on the Ethereum blockchain.</p>
      </section>
      <section className="instructions">
        <h2>How to Use</h2>
        <ol>
          <li>Install MetaMask from <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">here</a>.</li>
          <li>Connect your MetaMask wallet by clicking the button above.</li>
          <li>Use the deposit button to add 1 ETH to your balance.</li>
          <li>Use the withdraw button to remove 1 ETH from your balance.</li>
        </ol>
      </section>
      <style jsx>{`
        .container {
          font-family: 'Roboto', sans-serif;
          text-align: center;
          padding: 20px;
          background-color: #e0f7fa;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 0 auto;
        }
        header {
          margin-bottom: 20px;
        }
        h1 {
          color: #00796b;
        }
        .info, .instructions {
          margin: 20px 0;
          text-align: left;
        }
        .info h2, .instructions h2 {
          color: #004d40;
        }
        .instructions ol {
          list-style: none;
          padding: 0;
        }
        .instructions ol li {
          margin: 10px 0;
          padding: 10px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          background-color: #004d40;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #00251a;
        }
      `}</style>
    </main>
  );
}
