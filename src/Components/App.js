import React, { Component } from 'react';
import '../App.css';
// Components below
import TodosRemaining from './TodosRemaining';
import TodoItem from './TodoItem';
import TodosCheckAll from './TodosCheckAll';
import TodosFiltered from './TodosFiltered';
import TodosClearCompleted from './TodosClearCompleted';
import axios from 'axios';
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/todos';

class App extends Component {

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/todos`)
      .then(res => {
        let todos = res.data;
        let tenTodo = todos.filter((number) => {
          return number.id < 9
        })
        console.log(tenTodo)
        this.setState({ todos: tenTodo });
        console.log("GET req answer is " + res.status)
      })
  }

  render() {
    return (
      <div className="App">
        <h1>Let's Do It</h1>
        <div className="mainBlock">

          <input type='text'
            className='todo-input'
            placeholder="Gonna do"
            ref={this.todoInput}
            onKeyUp={this.addTodo}
          />

          <br />

          {this.todosFiltered().map((todo, index) =>
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              checkTodo={this.checkTodo}
              doneEdit={this.doneEdit}
              cancelEdit={this.cancelEdit}
              deleteTodo={this.deleteTodo}
              editTodo={this.editTodo}
            />

          )
          }

          <br />
          <div className="extra-container">
            <TodosCheckAll
              anyRemaining={this.anyRemaining}
              checkAllTodos={this.checkAllTodos}
            />
            <TodosRemaining remaining={this.remaining()} />
          </div>
          <br />

          <div className="extra-container">

            <div>
              <TodosFiltered
                updateFilter={this.updateFilter}
                filter={this.state.filter}
              />
            </div>

            {this.todosCompletedCount() > 0 &&
              <TodosClearCompleted
                clearCompleted={this.clearCompleted}
              />
            }

          </div>

        </div >
      </div >
    );
  }

  todoInput = React.createRef();

  state = {
    filter: 'all',
    beforeEditCash: '',
    idForTodo: 9,
    todos: []
  }

  addTodo = (event) => {
    if (event.key === 'Enter') {
      const todoInput = this.todoInput.current.value;

      if (todoInput.trim().length === 0) {
        return;
      }

      axios.post(`https://jsonplaceholder.typicode.com/todos`, {
        title: todoInput,
        completed: false,
      })
        .then(res => {
          alert("POST req status is " + res.status);
        })

      this.setState((prevState, props) => {
        let todos = prevState.todos;
        let idForTodo = prevState.idForTodo + 1;

        todos.unshift({
          id: idForTodo,
          title: todoInput,
          completed: false,
          editing: false
        })

        return { todos, idForTodo }
      });

      this.todoInput.current.value = '';
    }
  }

  deleteTodo = (index) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;

      todos.splice(index, 1);

      return { todos }
    });
  }

  checkTodo = (todo, index, event) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.completed = !todo.completed;

      todos.splice(index, 1, todo);

      return { todos }
    });
  }

  editTodo = (todo, index, event) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.editing = true;

      todos.splice(index, 1, todo);

      return { todos, beforeEditCash: todo.title }
    });
  }


  doneEdit = (todo, index, event) => {
    event.persist();

    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.editing = false;

      if (event.target.value.trim().length === 0) {
        todo.title = prevState.beforeEditCash;
      } else {
        todo.title = event.target.value;
      }

      todos.splice(index, 1, todo);

      return { todos }
    });
  }

  cancelEdit = (todo, index, event) => {
    event.persist();

    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.title = prevState.beforeEditCash;
      todo.editing = false;
      todos.splice(index, 1, todo);

      return { todos }
    });
  }


  remaining = () => {
    return this.state.todos.filter(todo => !todo.completed).length;
  }

  anyRemaining = () => {
    return this.remaining() !== 0;
  }

  todosCompletedCount = () => {
    return this.state.todos.filter(todo => todo.completed).length;
  }

  clearCompleted = () => {
    this.setState((prevState, props) => {
      // let todos = prevState.todos;
      // todos = todos.filter(todo => !todo.completed);
      // return { todos };

      return {
        todos: prevState.todos.filter(todo => !todo.completed)
      };
    })
  }

  updateFilter = filter => {
    this.setState({ filter });
  }

  todosFiltered = () => {
    if (this.state.filter === "all") {
      return this.state.todos;
    } else if (this.state.filter === "active") {
      return this.state.todos.filter(todo => !todo.completed);
    } else if (this.state.filter === "completed") {
      return this.state.todos.filter(todo => todo.completed);
    }
    return this.state.todos;
  }

  checkAllTodos = (event) => {
    event.persist();
    this.setState((prevState, props) => {
      let todos = prevState.todos;

      todos.forEach((todo) => todo.completed = event.target.checked);
      return { todos };
    })
  }

  retrieveTodos = (() => {
    console.log('working')
  })

}

export default App;
