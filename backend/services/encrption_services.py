from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import padding, hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.kdf.pbkdf2 import InvalidKey
    
import base64
import os
from dotenv import load_dotenv


load_dotenv()

class EncrptionServices:
    

    # Define the encryption key for AES
    # Generate public/private key pair

    @staticmethod
    def generate_key_pair():
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        public_key = private_key.public_key()
        return private_key, public_key
    
    @staticmethod
    def encrypt_private_key(private_key_bytes: bytes, encryption_key: bytes) -> str:
        # Use AES encryption in CBC mode (you can use another secure encryption algorithm if needed)
        iv = os.urandom(16)  # Generate a random IV (Initialization Vector)
        
        # Pad the private key to make it a multiple of block size
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(private_key_bytes) + padder.finalize()

        # AES encryption
        cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

        # Return IV + encrypted data, both base64 encoded
        return base64.b64encode(iv + encrypted_data).decode()


    @staticmethod
    def decrypt_private_key(encrypted_private_key: str, encryption_key: bytes) -> rsa.RSAPrivateKey:
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

        # Deserialize the decrypted private key back into an RSA private key object
        private_key = serialization.load_pem_private_key(unpadded_data, password=None, backend=default_backend())
        return private_key

    # Example of using the decrypted private key to sign a transaction
    @staticmethod
    def sign_transaction(private_key: rsa.RSAPrivateKey, transaction_data: str) -> str:
        transaction_hash = hashes.Hash(hashes.SHA256())
        transaction_hash.update(transaction_data.encode())
        transaction_digest = transaction_hash.finalize()

        signature = private_key.sign(
            transaction_digest,
            padding.PKCS1v15(),
            hashes.SHA256()
        )

        return base64.b64encode(signature).decode() 

     # Convert private key to bytes

    @staticmethod
    def get_private_key_bytes(private_key):
        private_key_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()  # Before encrypting
        )
        return private_key_bytes
    
    @staticmethod
    def serialize_public_key(public_key):
        # Assuming `public_key` is your RSAPublicKey object
        pem_public_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Convert PEM to a string for storage
        pem_public_key_str = pem_public_key.decode('utf-8')

        return pem_public_key_str
    
    @staticmethod
    def deserialize_public_key(serialized_public_key):
        # Convert PEM string back to a public key object
        retrieved_public_key = serialization.load_pem_public_key(
            serialized_public_key.encode('utf-8'),
            backend=default_backend()
        )
        return retrieved_public_key