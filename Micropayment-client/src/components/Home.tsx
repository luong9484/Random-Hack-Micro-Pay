import React, { useEffect } from "react";
import "../App.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
// import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { GrSecure } from "react-icons/gr";
import { SiFsecure } from "react-icons/si";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { AiOutlineRise } from "react-icons/ai";
import {useNavigate} from 'react-router-dom'

import {
  FaucetClient,
  Provider,
  Network,
} from "aptos";
// import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

const NODE_URL =
  process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL =
  process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

export const provider = new Provider(Network.DEVNET);
export const moduleAddress =
  "0xab813698b98db14276364f797e9e40086219425ae9b6dca306d0759d48458e81";
function Home() {
  // const aptos = new Aptos();
  const { account, signAndSubmitTransaction } = useWallet();
  const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
  const navigate = useNavigate();

  const create_channel = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    };

    const receiver_address = "0x9c684f4bf5488ff426efdfe05f2323223be27462cdcb573b247b12202477e442";
    const amount = 100000000;
    const no_of_tokens= 10000;
    const trust_token = "0x579eebe4c235303c73c65fe55db98ab0bf56aab55148411bbef60456ed8495b3";
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::micropayment_hash::create_channel`,
      type_arguments: [],
      arguments: [
        receiver_address ,
        amount,
        no_of_tokens,
        trust_token,
      ] 
    };
    console.log({payload});
    try{
      const res = await signAndSubmitTransaction(payload);
      console.log(res);
      await provider.waitForTransaction(res.hash);
      navigate('/gameasset');
      
    }catch(e){
      console.log(e);
    }
  };


  return (
    <div className="App">
      <header className="flex justify-between items-center px-10 bg-gray-100 shadow-md">
        <img src="μPay-logos_transparent.png" alt="" className="h-24 m-2" />
        {/* <h1 className="text-3xl font-bold m-5">μPay</h1> */}
        <div>
          <WalletSelector />
        </div>
      </header>
      <br />

      <h1 className="text-9xl font-bold font-sans m-5">μPay</h1>
      <p className="text-3xl italic m-3 mt-10">Pay less! Transact more!</p>

      <div className="flex items-center justify-center w-full flex-wrap">
        <div className="lg:w-[20%] md:w-[40%] flex items-center justify-center flex-col m-auto my-4 px-4 py-2 rounded-md mx-4 operateCard bg-white min-h-[100px] shadow-md">
          <GrSecure className="logo" size={40} />
          <p className="text-lg operateTitle"> Unforgeable</p>
        </div>
        <div className="lg:w-[20%] md:w-[40%] flex items-center justify-center flex-col m-auto my-4 px-4 py-2 rounded-md mx-4 operateCard bg-white min-h-[100px] shadow-md">
          <SiFsecure size={40} />
          <p className="text-lg "> Replay Resistant</p>
        </div>
        <div className="lg:w-[20%] md:w-[40%] flex items-center justify-center flex-col m-auto my-4 px-4 py-2 rounded-md mx-4 operateCard bg-white min-h-[100px] shadow-md">
          <MdOutlineIntegrationInstructions size={40} />
          <p className="text-lg ">Efficient</p>
        </div>
        <div className="lg:w-[20%] md:w-[40%] flex items-center justify-center flex-col m-auto my-4 px-4 py-2 rounded-md mx-4 operateCard bg-white min-h-[100px] shadow-md">
          <AiOutlineRise size={40} />
          <p className="text-lg ">Scalable</p>
        </div>
      </div>
      <p className="lg:w-2/5 md:w-1/2 w-full text-xl m-auto mt-16 px-4">
        By utilizing our micropayment services, you acknowledge and agree to the
        payment of 1 APT as per the pay-as-you-go framework.
      </p>
      <button
        onClick={create_channel}
        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
      >
        Approve
      </button>
      {/* {account && <p>{account.publicKey}</p>} */}
      {/* <div className="flex flex-col mt-3 mx-2">
        <div className="rounded-sm bg-gray-200 w-auto m-1 h-12 flex justify-center items-center cursor-pointer">
          Start Micropayment
        </div>
        <div className="rounded-sm bg-gray-200 w-auto m-1 h-12 flex justify-center items-center cursor-pointer">
          Receive Micropayment
        </div>
        <div className="rounded-sm bg-gray-200 w-auto m-1 h-12 flex justify-center items-center cursor-pointer">
          Transaction History
        </div>
        <div className="rounded-sm bg-gray-200 w-auto m-1 h-12 flex justify-center items-center cursor-pointer">
          User Profile
        </div>
        <div></div>
      </div> */}
    </div>
  );
}

export default Home;
