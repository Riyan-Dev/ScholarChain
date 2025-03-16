from web3 import Web3
from config.config import Config

# Connect to Ethereum node (Example: Ganache or Infura)
web3 = Web3(Web3.HTTPProvider(Config.rpc_url))  # or your RPC URL
