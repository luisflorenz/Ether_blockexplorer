import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlockNumber() {
      try {
        const blockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(blockNumber);
      } catch (err) {
        setError('Failed to fetch block number.');
      }
    }

    fetchBlockNumber();
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleGetBalance = async () => {
    setLoading(true);
    setError(null);
    setBalance(null);
    try {
      const balanceWei = await alchemy.core.getBalance(address);
      setBalance(alchemy.utils.formatEther(balanceWei));
    } catch (err) {
      setError('Failed to fetch balance. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ethereum Block Explorer</h1>
        <div className="block-info">
          <div>Current Block Number: {blockNumber ?? 'Loading...'}</div>
          <div>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter Ethereum address"
              className="address-input"
            />
            <button onClick={handleGetBalance} className="balance-button" disabled={!address || loading}>
              {loading ? 'Fetching...' : 'Get Balance'}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          {balance && <div>Balance: {balance} ETH</div>}
        </div>
      </header>
    </div>
  );
}

export default App;

