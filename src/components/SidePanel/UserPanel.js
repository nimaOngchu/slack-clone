import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react';
class UserPanel extends Component {
  render() {
    return (
        <Grid style = {{background: '#4c3c4c'}}>
            <Grid.Column>
                <Grid.Row style = {{padding: '1.2rem', margin: 0}}>
                    <Header></Header>
                </Grid.Row>
            </Grid.Column>
    </Grid>
    )
  }
}

export default UserPanel
