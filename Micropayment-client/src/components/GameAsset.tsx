import React, { useEffect, useState } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import data from "../data.json";

const pokemon = [
     {
         "id": 1,
         "image": "Bulbasaur.png",
         "name": "Bulbasaur",
         "purchased": false,
         "price": 0.001
     },
     {
         "id": 2,
         "image": "Charmander.png",
         "name": "Charmander",
         "purchased": false,
         "price": 0.001
     },{
         "id": 3,
         "image": "Eevee.png",
         "name": "Eevee",
         "purchased": false,
         "price": 0.001
     },{
         "id": 4,
         "image": "Pikachu.png",
         "name": "Pikachu",
         "purchased": false,
         "price": 0.001
     },{
         "id": 5,
         "image": "Psyduck.png",
         "name": "Psyduck",
         "purchased": false,
         "price": 0.001
     },{
         "id": 6,
         "image": "Scyther.png",
         "name": "Scyther",
         "purchased": false,
         "price": 0.002
     },{
         "id": 7,
         "image": "Squirtle.png",
         "name": "Squirtle",
         "purchased": false,
         "price": 0.001
     },{
         "id": 8,
         "image": "Tauros.png",
         "name": "Tauros",
         "purchased": false,
         "price": 0.002
     }
 
 ]
const GameAsset = () => {
    const [dataList, setdataList] = useState(pokemon)
   const handleChange = (id : number) => {
         const newList = dataList.map((item) => {
              if (item.id == id) {
                item.purchased = true
              }
              return item
         })
         setdataList(newList)
    }
  return (
    <div>
      <header className="flex justify-between items-center px-10 bg-gray-100 shadow-md">
        <img src="μPay-logos_transparent.png" alt="" className="h-24 m-2" />
        {/* <h1 className="text-3xl font-bold m-5">μPay</h1> */}
        <div>
          <WalletSelector />
        </div>
      </header>
      <div>
        <h1 className="text-5xl font-bold m-5 mx-auto text-center">
          Buy Game Assets
        </h1>
        <div>
          <div className="flex flex-row flex-wrap w-full justify-center">
            {pokemon.map((p) => {
              return (
                <div className=" lg:w-[20%] md:w-[40%] flex items-center justify-center flex-col m-auto my-4 px-4 py-2 rounded-md mx-4 operateCard bg-white min-h-[100px] shadow-md">
                  <img src={p.image} alt="" />
                  <div className="flex justify-between items-center w-full" key={p.id}>
                    <p className="text-lg font-bold">{p.name}</p>
                    {!p.purchased && <button onClick={() => handleChange(p.id)} className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded shadow-md">
                      Pay {p.price} APT
                    </button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAsset;
