import React, {Component} from 'react';
import axios from 'axios';
import Promise from 'bluebird';
//jobCoin API URLS
const api = 'http://jobcoin.gemini.com/unturned/api/';
const URLAddress = api + 'addresses';
const URLTransactions = api + 'transactions';
const houseAccount = 'houseAccount';

export default class Mixer extends Component {
  constructor(){
    super();
    this.state = {
      transaction: [],
      withdrawalAddresses: []
    };
    this.detectTransaction = this.detectTransaction.bind(this);
    this.transferJobCoin = this.transferJobCoin.bind(this);
    this.transferToWithDrawals = this.transferToWithDrawals.bind(this);
    this.generateRandomAmounts = this.generateRandomAmounts.bind(this);
  }


  componentDidMount(){
    const toAddress = this.props.match.params.depositAddress;
    let prom1 = axios.get(URLAddress + '/' + toAddress);
    let prom2 = axios.get(`/depositAddresses/${toAddress}`);
    Promise.all([prom1, prom2])
     .map(res => res.data)
     .spread((addressInfo, depositAdd) => {
       console.log(depositAdd, addressInfo);
       let fromAddress = depositAdd.parentAddress;
       let startTime = depositAdd.createdAt;
       let transactions = addressInfo.transactions;
       let transaction = this.detectTransaction(fromAddress, toAddress, startTime, transactions);
       this.setState({transaction});
     })
     .then(() => {
       // sends the transfer from depositAddress to houseAccount
       this.transferJobCoin(this.state.transaction.toAddress, houseAccount, this.state.transaction.amount);
     })
     .then(() => {
       //gets the withdrawal addresses
       axios.get(`/addresses/${this.state.transaction.fromAddress}`)
        .then(res => res.data)
        .then(withdrawalAddresses => {
          this.setState({withdrawalAddresses});
          console.log(withdrawalAddresses);
        })
        .then(() => {
          console.log('wth', this.state.withdrawalAddresses);
           this.transferToWithDrawals(this.state.transaction.amount, this.state.withdrawalAddresses);
         })
        .catch(err => console.log(err));
     });

  }

  //transfers jobcoins to given withdrawal addresses
  transferToWithDrawals(amount, addresses){
    let promArr = [];
    console.log('amount', amount, addresses)
    let transferNum = addresses.length;
    let withdrawalTransactions = [];
    let amounts = this.generateRandomAmounts(parseInt(amount), transferNum);
    for (let i = 0; i < transferNum; i++){
       promArr.push(this.transferJobCoin(houseAccount, addresses[i].address, amounts[i]));
       withdrawalTransactions.push({
         from: houseAccount,
         to: addresses[i].address,
         amount: amounts[i]
       });
    }
    console.log(promArr);
    Promise.all(promArr)
     .then(() => {
       this.setState({withdrawalTransactions});
       console.log('transactions are done');
      });
  }

  //genertes random amounts for each transfer to withdrawal address
  generateRandomAmounts(amount, transferNum){
    let amounts = [];
    let randomNumbers = [];
    let sum = 0;
    for (let i = 0; i < transferNum; i++){
      randomNumbers.push(Math.floor((Math.random() * 10) + 1));
   }
   for (let i = 0; i < transferNum; i++){
      sum += randomNumbers[i];
   }
   for (let i = 0; i < transferNum; i++){
     let amt = (amount / sum) * randomNumbers[i];
      amounts.push(amt.toString());
    }
    return amounts;
  }

  //creates a transaction
  transferJobCoin(from, to, amount){
    console.log(from, to, amount);
    console.log(this.state.transaction);
     return axios.post(URLTransactions, {
       fromAddress: from,
       toAddress: to,
       amount: amount
     })
      .then(() => {
        console.log('transaction ', from, ' ', to, ': ', amount);
      })
      .catch(err => console.log(err));
  }
   //finds the transfer that user made to depositAddress
  detectTransaction(from, to, startTime, transactions) {
        const tr = transactions.filter(transaction => transaction.fromAddress &&
        transaction.fromAddress.match(from) &&
        transaction.toAddress.match(to) &&
        transaction.timestamp > startTime
      );
      return tr[0];
        }

    render(){
      const withdrawalTransactions = this.state.withdrawalTransactions;
        return (
            <div>
             <h2> JobCoin Mix Results </h2>
             <div className="list-group">
             {withdrawalTransactions && withdrawalTransactions.map((transaction, index) => (
               <div className="list-group-item" key={index}>
                  <h5>
                   {transaction.to}: {transaction.amount}
                  </h5>
                </div>
             ))}
           </div>
           </div>
    );
    }
}
