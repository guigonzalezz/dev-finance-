const Modal = {
    open() {
        //Abri modal
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        //Fechar modal
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}


const Transaction = {
    all: [
        {
            description: 'Luz',
            amount: -50001,
            date: '23/01/2021,'
        },
        {
            description: 'Website',
            amount: 500012,
            date: '23/01/2021,'
        },
        {
            description: 'Interne',
            amount: -20000,
            date: '23/01/2021,'
        },
        {
            description: "iPhone",
            amount: 460000,
            date: '18/02/2021'
        },
    ],
    add(transaction){
        Transaction.all.push(transaction);
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes(){
        //somar as entradas
        let total = 0;
        Transaction.all.forEach(function(value){
            if(value.amount > 0)
                total += value.amount;
        })
        return total;
    },

    expenses(){
        //somar as saidas
        let total = 0;
        Transaction.all.forEach(function(value){
            if(value.amount < 0)
                total += value.amount;
        })
        return total;
    },

    total(){
        // expenses - incomes = total       
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="amount">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td clas="date">${transaction.date}</td>
            <td>
                <img src="../assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());

        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());

        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        return Number(value) * 100
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g,"")
        value = Number(value)/100

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "")
        {
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        event.preventDefault();

        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        }catch(error){
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance();
        
        
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init();
