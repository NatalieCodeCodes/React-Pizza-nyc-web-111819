import React, { Component, Fragment } from 'react';
import Header from './components/Header'
import PizzaForm from './components/PizzaForm'
import PizzaList from './containers/PizzaList'

class App extends Component {

  state = {
    pizzas: [],
    editedPizza: {}
  }

  componentDidMount () {
    fetch("http://localhost:3000/pizzas")
    .then(response => response.json())
    .then(pizzaData => this.setState({
      pizzas: pizzaData
    }))
  }

  editPizza = (pizza) => {
    this.setState({
      editedPizza: {
        id: pizza.id,
        topping: pizza.topping,
        size: pizza.size,
        vegetarian: pizza.vegetarian
      }
    })
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      editedPizza: {
        ...this.state.editedPizza,
        [e.target.name]: e.target.value
      }
    })
  }

  handleVeggie = (event) => {
    
    let veggieValue = (event.target.value === "Vegetarian" ? true : false)

    this.setState({
      ...this.state,
      editedPizza: {
        ...this.state.editedPizza,
        vegetarian: veggieValue
      }
    })
  }

  handleSubmit = () =>{

    let updatedPizza = this.state.editedPizza
    
    fetch(`http://localhost:3000/pizzas/${updatedPizza.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(updatedPizza)
    })
    .then(response => response.json())
    .then(data => {
      let updatedPizzas = this.state.pizzas.map(pizza => 
        pizza.id === updatedPizza.id ? {...data} : pizza
        )
        this.setState({
          pizzas: updatedPizzas
        })
    })
    this.setState({
      ...this.state,
      editedPizza: {
        ...this.state.editedPizza,
        topping: ""
      }
    })
  }

  render() {

    return (
      <Fragment>
        <Header/>
        <PizzaForm editedPizza={this.state.editedPizza} handleChange={this.handleChange} handleVeggie={this.handleVeggie} handleSubmit={this.handleSubmit}/>
        <PizzaList pizzas={this.state.pizzas} editPizza={this.editPizza}/>
      </Fragment>
    );
  }
}

export default App;

