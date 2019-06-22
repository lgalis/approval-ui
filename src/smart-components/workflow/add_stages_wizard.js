import React from 'react';
import { Button, Wizard } from '@patternfly/react-core';

export class AddWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleOpen = () => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    };
  }

  render() {
    const { isOpen } = this.state;

    const steps = [
      { name: 'Step 1', component: <p>Step 1</p> },
      { name: 'Step 2', component: <p>Step 2</p> },
      { name: 'Review', component: <p>Review</p>, nextButtonText: 'Submit' }
    ];

    return (
      <React.Fragment>
        <Button variant="primary" onClick={ this.toggleOpen }>
            Show Wizard
        </Button>
        { isOpen && (
          <Wizard
            isOpen={ isOpen }
            onClose={ this.toggleOpen }
            title="Add Workflow"
            description="Add Workflow"
            steps={ steps }
          />
        ) }
      </React.Fragment>
    );
  }
}
