from .config import *
from flask import Flask, request, jsonify, session, render_template
from flask_wtf.csrf import CSRFProtect
import logging

app = Flask(__name__)
from . import views
logging.basicConfig(level=logging.DEBUG)
app.config['SECRET_KEY'] = SECRET_KEY  # Change this to a random secret key
csrf = CSRFProtect(app)

contract_address= '0xdAC17F958D2ee523a2206206994597C13D831ec7'

@app.route('/post-address', methods=['POST'])
def post_address():
    data = request.get_json()
    address = data['address']
    if address:
        session['address'] = address  # Store the address in the session
        return jsonify(success=True, message="Address stored."), 200
    else:
        return jsonify(success=False, message="No address provided."), 400
    
@app.route('/get-transactions', methods=['GET'])
def get_erc20_transactions():
    addr = session.get('address')
    if not addr:
        return jsonify(success=False, message="No address stored."), 400
    logging.debug(f"addres: {addr}")
    address_info = {}
    transactions = []

    #Balance request
    balance_payload = {
        "module": "account",
        "action": "tokenbalance",
        "contractaddress": contract_address,
        "address": addr,
        "tag": "latest",
        "apikey": API_KEY
    }
    #ERC20 transaction request
    erc20_payload = {
        "module": "account",
        "action": "tokentx",
        "contractaddress": contract_address,
        "address": addr,
        "page": 1,
        "offset": 5,
        "startblock": 0,
        "endblock": 27025780,
        "sort": "asc",
        "apikey": API_KEY
        }
    logging.debug("Try to get data here")
    try:
        transactions_response = requests.get(ETHERSCAN_API,params=erc20_payload)
        balance_response = requests.get(ETHERSCAN_API,params=balance_payload)
        transactions_response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        balance_response.raise_for_status()
        logging.debug("data recive")
        transfer_events = transactions_response.json()
        balance = float(balance_response.json()['result'])/(10**6)

        logging.debug("balance formated")
        for tx in transfer_events['result']:
            logging.debug(tx)
            from_addr = tx['from']
            to_addr = tx['to']
            amount = float(tx['value']) / (10 ** int(tx['tokenDecimal']))

            if tx["tokenSymbol"] != "USDT":
                continue
            logging.debug("appending data")
            transactions.append({
                'from': from_addr,
                'to': to_addr,
                'amount': amount
            })
        logging.debug("Put data to dictionary")
        address_info = {'balance': balance,
                        'transactions': transactions}
        logging.debug(f"address_info: {address_info}")
        return jsonify(success=True, data=address_info)
    except requests.exceptions.HTTPError as e:
        return jsonify(success=False, error=str(e)), 500
    except Exception as e:
        # Catch any other errors
        return jsonify(success=False, error=str(e)), 500