import React, {useContext} from 'react';
import { Button } from 'antd';

import { Web3WalletContext } from '../../providers/Web3WalletProvider';

const Web3LoginButton = () => {
    const { onConnect, onDisconnect, isConnected } = useContext(Web3WalletContext);

    return (isConnected ? 
        <Button onClick={onDisconnect} className='wallet-connect-button'>Disconect Wallet</Button> :
        <Button onClick={()=> onConnect()} className='wallet-connect-button'>
            <img src="/assets/img/metamask.svg" alt="MetaMask logo" className="w-1/5 inline metamask-logo-login-button"/>
            Connect Wallet
        </Button>);
}

export default Web3LoginButton;