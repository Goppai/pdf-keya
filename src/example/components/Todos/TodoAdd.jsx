import React, { Component } from 'react';

import { withMutations } from 'cozy-client';
import { FormattedMessage } from 'react-intl';

import { TODOS_DOCTYPE } from '../../doctypes';

export class TodoAdd extends Component {
  constructor(props, context) {
    super(props, context);
    // initial component state
    this.state = {
      todoToAdd: '',
      isWorking: false
    };
  }

  // handle input value change
  handleChange = event => {
    this.setState({ todoToAdd: event.target.value });
  };

  // create the new todo
  handleSubmit = async () => {
    const { todoToAdd } = this.state;
    const { createDocument } = this.props;
    // reset the input and display a spinner during the process
    this.setState(() => ({ todoToAdd: '', isWorking: true }));
    await createDocument(TODOS_DOCTYPE, { name: todoToAdd });
    // remove the spinner
    this.setState(() => ({ isWorking: false }));
  };

  render() {
    const { todoToAdd } = this.state;
    return (
      <div>
        <h2>
          <FormattedMessage
            id="example.addTodo"
            defaultMessage="Add a new Todo:"
          />
        </h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="todo-add-input">
            <FormattedMessage
              id="example.todoName"
              defaultMessage="Todo name: "
            />
          </label>
          <input
            value={todoToAdd}
            onChange={this.handleChange}
            id="todo-add-input"
          />
          <button
            onClick={this.submit}
            type="submit"
            label="add"
            size="large"
            extension="narrow"
          />
        </form>
      </div>
    );
  }
}

// get mutations from the client to use createDocument
export default withMutations()(TodoAdd);
