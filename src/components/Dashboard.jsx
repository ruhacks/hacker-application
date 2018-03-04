import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { firebaseApp } from '../firebase';
import * as Bulma from 'reactbulma';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
 
  render() {
    return (
      <div>
        <Bulma.Hero info bold>
          <Bulma.Hero.Head>
          </Bulma.Hero.Head>
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
          <Bulma.Hero.Foot>
          </Bulma.Hero.Foot>
        </Bulma.Hero>
        <Bulma.Container id='dashboard-messages'></Bulma.Container>
      </div>
    );
  }
}

export default Dashboard;
