from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class TransactionForm(FlaskForm):
    account_address = StringField('Account Address', validators=[DataRequired()])
    account_tag = StringField('Account Tag')  # This can be optional
    show_transactions = SubmitField('Show Transactions')
    set_account_details = SubmitField('Set Account Details')