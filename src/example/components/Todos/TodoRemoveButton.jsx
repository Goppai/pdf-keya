import React, { Component } from 'react';

import { withMutations } from 'cozy-client';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  delete: {
    id: 'example.delete',
    defaultMessage: 'Delete'
  }
});

export class TodoRemoveButton extends Component {
  constructor(props) {
    super(props);
    // initial component state
    this.state = { isWorking: false };
  }

  // delete the related todo
  removeTodo = async () => {
    const { deleteDocument, todo } = this.props;
    // display a spinner during the process
    this.setState(() => ({ isWorking: true }));
    // delete the todo in the Cozy : asynchronous
    await deleteDocument(todo);
    // remove the spinner
    // this.setState(() => ({ isWorking: false }))
    // We can omit that since this component will be
    // unmount after the document is deleted by the client
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { isWorking } = this.state;
    return (
      <button
        className="todo-remove-button"
        theme="danger"
        label={formatMessage(messages.delete)}
        disabled={isWorking}
        onClick={this.removeTodo}
        extension="narrow"
      />
    );
  }
}

// get mutations from the client to use deleteDocument
export default injectIntl(withMutations()(TodoRemoveButton));
