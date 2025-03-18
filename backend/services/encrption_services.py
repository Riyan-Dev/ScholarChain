from config.config import Config
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import padding

from RPC_server import web3

from cryptography.hazmat.backends import default_backend
from hashlib import sha256
    
import base64
import os
from dotenv import load_dotenv


load_dotenv()

class EncrptionServices:
    
    

    @staticmethod
    def generate_key_pair():
                # Connect to the Ethereum node (e.g., Ganache, Infura)

        # Check if connected
        if web3.is_connected():
            print("Connected to Ethereum network")
        else:
            print("Connection failed")


        # Generate a new account
        new_account = web3.eth.account.create()

        accounts = web3.eth.accounts
        # Get the address and private key
        receiver_address = new_account.address
       
        # Account details
        sender_address = accounts[0]
        # receiver_address = EncrptionServices.get_ethereum_address(public_key)
        amount_to_send = web3.to_wei(1, 'ether')  # 1 Ether in Wei
        # Private key (example, don't use this in production)
        private_key = Config.faucet_private_key

        # Create the transaction
        transaction = {
            'to': receiver_address,
            'value': amount_to_send,
            'gas': 2000000,
            'gasPrice': web3.to_wei('20', 'gwei'),
            'nonce': web3.eth.get_transaction_count(sender_address),
            'chainId': 1337  # Chain ID for Ganache (or 1 for Mainnet, etc.)
        }
        # Sign the transaction with the sender's private key
        signed_transaction = web3.eth.account.sign_transaction(transaction, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.raw_transaction)

        # Print the transaction hash
        print(f"Transaction sent! Hash: {web3.to_hex(tx_hash)}")
        
        # Generate public/private key pair
        return new_account._private_key, new_account.address
    
    @staticmethod
    def encrypt_private_key(private_key_bytes: bytes) -> str:
        base64_key = Config.encryption_key
        encryption_key = base64.b64decode(base64_key)
        # Ensure the encryption key length is 32 bytes (for AES-256)
        if len(encryption_key) not in [16, 24, 32]:
            raise ValueError("Encryption key must be 16, 24, or 32 bytes long.")
        
        # Generate a random IV (Initialization Vector)
        iv = os.urandom(16)
        
        # Pad the private key to make it a multiple of block size (128 bits for AES)
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(private_key_bytes) + padder.finalize()

        # AES encryption in CBC mode
        cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

        # Return IV + encrypted data, base64 encoded
        return base64.b64encode(iv + encrypted_data).decode()

    @staticmethod
    def decrypt_private_key(encrypted_private_key: str) -> bytes:
        base64_key = Config.encryption_key
        encryption_key = base64.b64decode(base64_key)
        # Ensure the encryption key length is 32 bytes (for AES-256)
        if len(encryption_key) not in [16, 24, 32]:
            raise ValueError("Encryption key must be 16, 24, or 32 bytes long.")

        # Decode the base64 encoded encrypted private key
        encrypted_data = base64.b64decode(encrypted_private_key)

        # Extract the IV (first 16 bytes) and the encrypted private key (remaining data)
        iv = encrypted_data[:16]
        encrypted_private_key_bytes = encrypted_data[16:]

        # Decrypt the private key using AES
        cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_data = decryptor.update(encrypted_private_key_bytes) + decryptor.finalize()

        # Unpad the decrypted private key
        unpadder = padding.PKCS7(128).unpadder()
        unpadded_data = unpadder.update(decrypted_data) + unpadder.finalize()

        # Return the decrypted private key bytes
        return unpadded_data

    # Example of using the decrypted private key to sign a transaction
    # Sign transaction using private key
    