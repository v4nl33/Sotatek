import { Col,Row } from 'antd';
import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {AiOutlineQrcode,AiTwotoneContainer,AiOutlineKey} from 'react-icons/ai';
import WalletAlert from "../component/WalletAlert";
import WalletInputModal from "../component/WalletInputModal";
import {SERVER_URL} from "../../constants/env";
import setAuthToken from "../../utils/setAuthToken"
import Wallet from "../../utils/wallet";
import openNotification from "../helpers/notification";
import {Web3WalletContext} from '../providers/Web3WalletProvider';

function WalletManageKeys(props) {
  const [t] = useTranslation();
  const [address,setAddress] = useState(localStorage.getItem("publicKey"));
  const [content,setContent] = useState("No information!");
  const [contentType,setContentType] = useState({name:"privateKey",title:"PrivateKey"});
  const [contentModal,setContentModal] = useState(false);
  const [passwordModal,setPasswordModal] = useState(false);

  const { address: web3Address, isConnected } = useContext(Web3WalletContext);

  const wallet = new Wallet();

  useEffect(() => {
    if(isConnected){setAddress(web3Address);}
  }, [isConnected,web3Address])

  const setContentPrivateKey = ()=>{
    setContentType({name:"privateKey",title:"PrivateKey"});
    setPasswordModal(true);
  }
  const setContentPhrase = ()=>{
    setContentType({name:"phrase",title:"Key Phrase"});
    setPasswordModal(true);
  }

  const confirmPassword = (password)=>{
    setAuthToken(localStorage.jwtToken)
    axios.post(SERVER_URL + "wallets/getsecret", {
      type:contentType.name,
      password: password,
      publicKey:address,
      network:props.network.url
    }).then((response) => {
      if(response.data.response){
        setPasswordModal(false);
        setContent(wallet.decrypt(response.data.data));
        setContentModal(true);
      }
      else
      {
        openNotification("Failed",response.data.message,false,null)
      }
    })
  }
  return (
    <>
    <Col className="p-4" span={24} >  
      <Row className="mt-4 myColor1 ">
        <Col span={12} className=" font-bold">
          <AiOutlineQrcode size={20} className="inline mr-2"/>{t("Wallet Address")}
        </Col>
        <Col span={6} className="text-right">
          {t("View Key Phrase")}
        </Col>
        <Col span={6} className="text-right">
          {t("View Private Key")}
        </Col>
      </Row>

      <Row className="mt-4 myColor1">
        <Col span={12} className=" font-bold text-overflow">
          {address}
        </Col>
        {isConnected && <><Col span={6} className="text-right">
          <span onClick={setContentPhrase}><AiTwotoneContainer size={20} className="inline mr-2"/></span>
        </Col>
        <Col span={6} className="text-right">
          <span onClick={setContentPrivateKey}><AiOutlineKey size={20} className="inline mr-2"/></span>
        </Col></>}
      </Row>
    </Col>
    {
      contentModal?
        <WalletAlert content={content} setModalShow={setContentModal} title={contentType.title}/>
      : null
    }
    {
      passwordModal?
        <WalletInputModal confirm={confirmPassword}  setModalShow={setPasswordModal}/>
      : null
    }
    
    </>
  );
}

export default WalletManageKeys;
