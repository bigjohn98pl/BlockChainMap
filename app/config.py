import os
import eth_utils as eth
import requests

# Set up the Etherscan API endpoint and your API key
ETHERSCAN_API = 'https://api.etherscan.io/api'
API_KEY = os.environ['ETHERSCAN_API_KEY']

SECRET_KEY = os.urandom(24)