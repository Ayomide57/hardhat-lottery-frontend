import { NextComponentType } from "next";
import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from 'react-moralis';
import { abi, contractAddresses } from "../constants";
import { ethers } from 'ethers';
import { useNotification } from "web3uikit";

const EntranceSection: NextComponentType = () => {

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const [entranceFee, updateEntranceFee] = useState<any>("0");
    const [numPlayers, setNumPlayers] = useState<any>("0");
    const [recentWinner, setRecentWinner] = useState<any>("0");
    const chainId = parseInt(chainIdHex!);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();

    const { runContractFunction: enterLottery, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    });


    useEffect(() => {
        if (isWeb3Enabled) {
            const updateUI = async () => {
                const entranceFeeFromContract: any = await getEntranceFee();
                const numPlayersFromContract: any = await getNumberOfPlayers();
                const recentWinnerFromContract: any = await getRecentWinner();
                updateEntranceFee(entranceFeeFromContract.toString())
                setNumPlayers(numPlayersFromContract.toString());
                setRecentWinner(recentWinnerFromContract);

            }
            updateUI();
        }
    }, [
        isWeb3Enabled,
        numPlayers,
        recentWinner,
        getEntranceFee,
        getNumberOfPlayers,
        getRecentWinner
    ]);
    console.log(entranceFee);

    const handleSuccess = async (tx:any) => {
        await tx.wait();
        handleNewNotification(tx);
    }

    const handleNewNotification = (tx: any) => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
        })
    }


    return (
        <div>
            <p>Number of players: {numPlayers}</p>
            <button
                className="bg-blue-400 hover:bg-blue-700 text-white p-4 rounded-md"
                onClick={async () => {
                    await enterLottery({
                        onSuccess: handleSuccess,
                        onError(error) {
                            console.log(error)
                        },
                    });
            }}
                disabled={isLoading || isFetching}
            >{isLoading || isFetching ?
                    (<div className="animate-spin spinner h-8 w-8 border-b-2 rounded-full"></div>) :
                    (<p>Enter Lottery</p>)}</button>
            <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}</p>

            <p>Recent Winner: {recentWinner}</p>
        </div>
    )
}

export default EntranceSection;