import { NextComponentType } from "next";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader: NextComponentType = () => {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem('connected')) {
                enableWeb3();
            }
        }

        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3()
            }
        });


    },[Moralis, deactivateWeb3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading]);


    return (
        <div>
            {
                account ?
                    (<div> 
                        <p>Connected!</p>
                        <p>{account.slice(0, 6)}....{account.slice(account.length - 4)}</p>
                    </div> )
                    : (<button
                        onClick={
                            async () => {
                                await enableWeb3()
                                if (typeof window !== 'undefined') {
                                    window.localStorage.setItem('connected', "injected")
                                }
                            }
                        }
                        disabled={isWeb3EnableLoading}
                    > Connect1 </button>)
            }
        </div>
    )
}

export default ManualHeader;