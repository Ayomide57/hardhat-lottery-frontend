import { NextComponentType } from "next";
import React from "react";
import { ConnectButton } from "web3uikit";


const Header: NextComponentType = () => {


    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-2 text-lg font-bold">Decentralise Lottery</h1>
            <ConnectButton />
        </div>
    )
}

export default Header;