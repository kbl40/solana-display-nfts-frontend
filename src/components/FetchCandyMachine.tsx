import { useConnection } from "@solana/wallet-adapter-react"
import { Connection, PublicKey } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import { FC, useEffect, useMemo, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState(null)
  const [candyMachineData, setCandyMachineData] = useState(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)
  const { connection } = useConnection()
  
  const metaplex = useMemo(() => {
    return Metaplex.make(connection)
  }, [connection])

  const fetchCandyMachine = async () => {
    setPage(1)

    try {
      const candymachine = await metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(candyMachineAddress)})
        .run()

      setCandyMachineData(candymachine)
    } catch (error) {
      alert('Please submit a valid Candy Machine V2 addres')
    }
  }

  const getPage = async (page, perPage) => {
    const pageItems = candyMachineData.items.slice(
      (page - 1) * perPage,
      page * perPage
    )

    let nftData = []
    for (let i = 0; i < pageItems.length; i++) {
      let fetchResult = await fetch(pageItems[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    setPageItems(nftData)

  }

  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  const next = async () => {
    setPage(page + 1)
  }

  useEffect(() => {
    if (!candyMachineData) return

    getPage(page, 9)
  }, [candyMachineData, page])

  return (
    <div>
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
        placeholder="Enter Candy Machine v2 Address"
        onChange={(e) => setCandyMachineAddress(e.target.value)}
      />
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={fetchCandyMachine}
      >
        Fetch
      </button>

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Candy Machine Address: {candyMachineData.address.toString()}</ul>
        </div>
      )}

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Candy Machine Program Address: {candyMachineData.programAddress.toString()}</ul>
          <ul>Authority Address: {candyMachineData.authorityAddress.toString()}</ul>
          <ul>Token Address: 
            {
              candyMachineData.tokenMintAddress ? candyMachineData.tokenMintAddress
              : " none"
            }
          </ul>
          <ul>Seller Royalty: {candyMachineData.sellerFeeBasisPoints / 100}%</ul>
          <ul>NFTs Minted: {candyMachineData.itemsMinted.toString()}</ul>
          <ul>NFTs Available: {candyMachineData.itemsRemaining.toString()}</ul>
        </div>
      )}
      {pageItems && (
        <div>
          <div className={styles.gridNFT}>
            {pageItems.map((nft) => (
              <div>
                <ul>{nft.name}</ul>
                <img src={nft.image} />
              </div>
            ))}
          </div>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={prev}
          >
            Prev
          </button>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
