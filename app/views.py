from . import app
from flask import render_template

# Import your forms
from .forms import TransactionForm

# Example of a view function using the form
@app.route('/', methods=['GET', 'POST'])
def index():
    form = TransactionForm()
    if form.validate_on_submit():
        # Process the form data
        pass
    return render_template('index.html', form=form)