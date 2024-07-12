const mongoose = require('mongoose');
const Customer = require('./model/customer.js');
const dotenv = require('dotenv').config();

const prompt = require('prompt-sync')();

const username = prompt('What is your name? ');
const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

console.log(`Welcome, ${capitalize(username)}`);

const createCustomer = async () => {
    const cusName = prompt('Enter new cutomer\s name: ');
    const cusAge = prompt('Enter new customer\s age: ')

    const customerData = await Customer.create({
        name: cusName,
        age: Number(cusAge),
    })
}

const viewCustomer = async () => {
    const allCustomers = await Customer.find();
    console.log('List of customers: \n', allCustomers);
}

const updateCustomer = async () => {
    const customerId = prompt('Enter the customer\s id you want to update (copy-paste the id): ');
    const cusName = prompt('What is cutomer\s new name: ');
    const cusAge = prompt('What is customer\s new age: ');
    const updateCustomerData = await Customer.findByIdAndUpdate(customerId, {
        name: cusName,
        age: cusAge,
    }, { new: true })
    console.log(updateCustomerData);
}

const deleteCustomer = async () => {
    const getCustomerId =  prompt('Enter the customer\s id you want to delete (copy-paste the id): ');
    const deleteCustomerData = await Customer.findById(getCustomerId);
    await deleteCustomerData.deleteOne();
    console.log('Deleted'); 
}

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await runMyQueries();
    await mongoose.disconnect();
    process.exit();
}

const runMyQueries = async () => {
    loop: while (true) {
        console.log(`What would you like to do today? \n1. Create a new customer \n2. View all customers \n3. Update a customer \n4. Delete a customer \n5. Quit operation`);
        const userChoice = parseInt(prompt('Type your action number here: ' ));
    
        switch(userChoice) {
            case 1:
                await createCustomer();
                break;
            case 2:
        
                await viewCustomer();
                break;
            case 3:
                await updateCustomer();
                break;
            case 4:
                await deleteCustomer();
                break;
            case 5:
                console.log('exiting...')
                // .close closes our active session while preventing any memory leaks or hanging process
                mongoose.connection.close(); 
                break loop;
            default:
                console.log('Invalid input, type the number associated with the operation you want to perform!');
                break;
            }
    }

}

connect();