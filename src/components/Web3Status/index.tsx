import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken, lighten } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { isMobile } from 'react-device-detect'
// import { useWallet, ConnectType } from '@terra-money/wallet-provider'
import { injected } from '../../connectors'
// import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import {useActiveReact} from '../../hooks/useActiveReact'
// import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress1 } from '../../utils'
import { ButtonSecondary } from '../Button'

import Identicon from '../Identicon'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

import NoWalletTxList from '../AccountDetails/NoWalletTxList'

// import { ChainId } from '../../config/chainConfig/chainId'

import {useConnectWallet} from '../../hooks/useWallet'
import { ChainId } from '../../config/chainConfig/chainId'
// import config from '../../config'

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  height: 38px;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background: ${({ theme }) => theme.red1}!important;
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary2};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.primary2)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background: ${({ pending, theme }) => (pending ? theme.primary1 : theme.primary2)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.white)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? theme.primary1 : lighten(0.05, theme.bg2))};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : darken(0.1, theme.bg3))};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { connector, error } = useWeb3React()
  // const { connect } = useWallet()
  const {account, chainId} = useActiveReact()
  // console.log(error)
  const { ENSName } = useENSName(account && !isNaN(chainId) ? account : undefined)
  // console.log(ENSName)
  const allTransactions = useAllTransactions()

  const connectWallet = useConnectWallet()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  // const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={connectWallet} pending={hasPendingTransactions}>
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>{pending?.length} {t('Pending')}</Text> <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>{
            isMobile ? (
              <Text>{ENSName || shortenAddress1(account, 2)}</Text>
            ) : (
              <Text>{ENSName || shortenAddress1(account)}</Text>
            )
          }
          </>
        )}
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={connectWallet}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? t('WrongNetwork') : t('Error')}</Text>
      </Web3StatusError>
    )
  // } else if (config?.chainInfo?.[chainId]?.chainType === 'NOWALLET') {
  } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={connectWallet} pending={hasPendingTransactions}>
        <Text>{chainId}</Text>
        {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={connectWallet} faded={!account}>
        <Text>{t('Connect Wallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  // const { active } = useWeb3React()
  // const contextNetwork = useWeb3React(NetworkContextName)

  // const {account} = useActiveReact()
  const {chainId} = useActiveReact()

  const allTransactions = useAllTransactions()
  // console.log(allTransactions)
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)
  // console.log(contextNetwork)
  // console.log(active)
  // if (!contextNetwork.active && !active) {
  //   return null
  // }
  if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) {
    return (
      <>
        <Web3StatusInner />
        <NoWalletTxList pendingTransactions={pending} confirmedTransactions={confirmed} />
      </>
    )
  }
  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
