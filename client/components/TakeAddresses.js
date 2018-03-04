import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const axios = require('axios');
let depositAddress = '';
let tempAdd = [];
import Promise from 'bluebird';

export default class TakeAddresses extends Component {

  constructor(){
    super();
    this.state = {
      parentAddress: '',
      withdrawaladdresses: [],
      depositAddress: '',
      depositAddresses: []
    };
    this.handleChangeParentAddress = this.handleChangeParentAddress.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateDepositAddress = this.generateDepositAddress.bind(this);
  }

  componentDidMount(){
    //takes all deposit addresses created in db
    axios.get('/depositAddress')
    .then(res => res.data)
    .then(depositAddresses => {
      let tempDep = [];
      for (let i = 0; i < depositAddresses.length; i++){
        tempDep.push(depositAddresses[i].depositAddress);
      }
        this.setState({depositAddresses: tempDep});
     })
      .catch(err => console.log(err));
  }

  //takes main addres value from user
  handleChangeParentAddress (e){
    e.preventDefault();
    this.setState({parentAddress: e.target.value});
  }

  //takes withdrawal addresses from user
  handleChangeAddress (e){
    e.preventDefault();
    tempAdd = e.target.value.split(', ');
    this.setState({withdrawaladdresses: tempAdd});
  }

  //stores withdrawal addreses to db
  //gives the user unique deposit address
  handleSubmit(e){
    e.preventDefault();
    let promArr = [];
    const parentAddress = this.state.parentAddress;
    const withdrawaladdresses = this.state.withdrawaladdresses;

    for (let i = 0; i < withdrawaladdresses.length; i++) {
       promArr.push(axios.post('/address', {
          parentAddress, address: withdrawaladdresses[i]
         }));
    }
    Promise.all(promArr)
     .then(() => {
       console.log('all withdrawal addresses are taken');
      //checks that depositAddress is unique or not
       while (depositAddress === '') {
         depositAddress = this.generateDepositAddress();
       }
       this.setState({depositAddress});
     })
     .then(() => {
       axios.post('/depositAddress', {
         parentAddress, depositAddress: this.state.depositAddress
       })
       .then(() => {
         console.log('deposit addres is stored in db');
       })
       .catch((err => console.log(err)));
     })
     .catch(err => console.log(err));
  }

  //generates for user a new deposit address
   generateDepositAddress(){
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));

    if(this.state.depositAddresses.includes(text))
       text = ''
    return text;
   }

  render () {
    const depositAddress = this.state.depositAddress;
    return (
    <div className="well">
   {depositAddress
    ? <div>
    <span> you can transfer to this address: {depositAddress} </span>
    <div>
    <Link to={`/mixerLogs/${depositAddress}`}>Click here to see the logs</Link>
    </div>
    </div>
    : <div>
    <h1> Welcome to JobCoin Mixer</h1>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
      <fieldset>
      <legend>Main Addreses</legend>
        <div className="form-group">
          <div className="col-xs-10">
            <input className="form-control" type="text-field" placeholder= "enter your main addres" onChange={this.handleChangeParentAddress} />
          </div>
        </div>
        <legend>Withdrawal Addreses</legend>
        <div className="form-group">
          <div className="col-xs-10">
            <input className="form-control" type="text-field" placeholder= "enter the with drawal addreses seperating by comma" onChange={this.handleChangeAddress} />
          </div>
        </div>
        <div className="form-group">
        <div className="col-xs-10 col-xs-offset-2">
          <button type="submit" className="btn btn-success">Add</button>
        </div>
      </div>
        </fieldset>
  </form>
  </div>}
  </div>
    );
  }
}
