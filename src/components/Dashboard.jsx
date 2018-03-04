import React, { Component } from 'react'
import * as Bulma from 'reactbulma'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <Bulma.Hero info bold>
          <Bulma.Hero.Head />
          <Bulma.Hero.Body>
            <Bulma.Container>
              <Bulma.Title>
                RU Hacks
              </Bulma.Title>
              <Bulma.SubTitle>
                Freedom to Innovate
              </Bulma.SubTitle>
            </Bulma.Container>
          </Bulma.Hero.Body>
          <Bulma.Hero.Foot />
        </Bulma.Hero>
        <Bulma.Content id='dashboard-messages' />
      </div>
    )
  }
}

export default Dashboard
