const Modal = {
    toggle(){
        document.querySelector('.modal-overlay').classList.toggle('active');
    },

    toggleError(){
        document.querySelector('.modal-error').classList.toggle('active');
    }
}

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
    }
}


const Transaction = {
    all: Storage.get(),
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index;        

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const darkClass = document.querySelector('body').classList.contains("dark-theme-body") ? "dark-theme-td" : ""
         

        const html = `
            <td class="amount ${darkClass}">${transaction.description}</td>
            <td class="${CSSclass} ${darkClass}">${amount}</td>
            <td class="date ${darkClass}">${transaction.date}</td>
            <td class="${darkClass}">
                <img onclick="Transaction.remove(${index})" id="minus-img" src="../assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());

        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
        
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
        //Changing color if the value is negative or positive
        const total = Transaction.total()
        if(total < 0){
            document.querySelector('.card.total').style.background = "#e92929";
        }
        else{
            document.querySelector('.card.total').style.background = "#49aa26";
        }
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },

    changeTheme(){
        document.querySelectorAll('th').forEach(elem => {
            elem.classList.toggle('dark-theme-th')
        })
        document.querySelectorAll('td').forEach(elem => {
            elem.classList.toggle('dark-theme-td')
        })
        document.querySelector('body').classList.toggle('dark-theme-body');
        document.querySelector('header').classList.toggle('dark-theme-header');
        document.getElementById('income-card').classList.toggle('dark-theme-card');
        document.getElementById('expense-card').classList.toggle('dark-theme-card');
        document.getElementById('new-transaction').classList.toggle('dark-theme-nt');
        document.querySelector('footer').classList.toggle('dark-theme-footer')
    }
}

const Utils = {
    formatAmount(value) {
        return Math.round(Number(value) * 100)
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
            
            throw new Error(Modal.toggleError())
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
            Modal.toggle()
        }catch(error){
        }
    }
}



const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)//essa função é o argumento transaction e index
        
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init();
