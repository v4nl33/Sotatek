import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3WalletContextTemplate = {
  isConnected : Boolean,
  setIsConnected : (val) => {},
  onConnect : () => {},
  onDisconnect: () => {},
  address: String|undefined
}

const Web3WalletContext = React.createContext(Web3WalletContextTemplate);
const Web3WalletProviderDOM = Web3WalletContext.Provider;

function Web3WalletProvider(props) {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState(undefined);

    useEffect(() => {getCurrentWalletConnected()})

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.log("Non-ethereum browser detected. You should install Metamask");
        }
        return provider;
    }

    const onConnect = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if(currentProvider) {
                await currentProvider.request({method: 'eth_requestAccounts'});
                await getCurrentWalletConnected();
            }
        } catch(err) {
            console.error(err);
        }
    }

    const getCurrentWalletConnected = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if(currentProvider) {
                await currentProvider.request({method: 'eth_accounts'});
                const web3 = new Web3(currentProvider);
                const userAccounts  = await web3.eth.getAccounts();
                if (userAccounts.length){
                    setAddress(userAccounts[0])
                    setIsConnected(true);
                }
            }
        } catch(err) {
            console.error(err);
        }
    }
    
    const onDisconnect = () => {
        setIsConnected(false);
    }

    return(
          <Web3WalletProviderDOM 
            value={{
                isConnected,
                setIsConnected,
                onConnect,
                onDisconnect,
                address
          }}>
            {props.children}
          </Web3WalletProviderDOM>

    )
}

export {Web3WalletContext};
export default Web3WalletProvider;