import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { firebaseApp } from '../firebase';
import * as Bulma from 'reactbulma';

function SkillSelection(props) {
  const skills = props.app.state.skillSelection;
  const skillEl = [];

  Object.keys(skills).forEach((skill, index) => {
    skillEl.push(
      <div className="field" key={index}>
        <div className="control">
          <label htmlFor={`experience-${skill}`} className="checkbox">
            <input id={`experience-${skill}`} type="checkbox" value={skill} name="experience"
              checked={skills[skill].checked}
              onChange={(event) => props.app.updateSkillSelect(skill)}
            />
            {skills[skill].label}
          </label>
        </div>
      </div>
    )
  });

  return (skillEl.length > 0 ? skillEl : null);
}

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userApplication: {
        name: {
          first: '',
          last: '',
        },
        gender: '',
        education: {
          status: '',
          school: '',
          schoolOther: '',
          program: '',
          year: 1,
        },
        location: {
          country: '',
          countryOther: '',
          city: '',
        },
        skills: [],
        experience: {
          portfolio: '',
          repo: '',
          other: '',
          resume: ''
        },
        hacking: {
          level: 0,
          whyAttend: '',
          creation: '',
        },
        mlh: false,
      },
      skillSelection: {
        'analytics': {
          checked: false,
          label: 'Analytics'
        },
        'android': {
          checked: false,
          label: 'Android'
        },
        'ar': {
          checked: false,
          label: 'Augmented Reality (AR)'
        },
        'dba': {
          checked: false,
          label: 'Database Administration (DBA)'
        },
        'hardware': {
          checked: false,
          label: 'Hardware'
        },
        'graphic-design': {
          checked: false,
          label: 'Grahpic Design'
        },
        'full-stack': {
          checked: false,
          label: 'Full Stack Development'
        },
        'ia': {
          checked: false,
          label: 'Information Architecture (IA) Design'
        },
        'ixd': {
          checked: false,
          label: 'Interaction Design (IxD)'
        },
        'iot': {
          checked: false,
          label: 'Internet of Things (IoT)'
        },
        'ios': {
          checked: false,
          label: 'iOS'
        },
        'linux-unix': {
          checked: false,
          label: 'Linux/Unix'
        },
        'machine-learning': {
          checked: false,
          label: 'Machine Learning'
        },
        'qa-testing': {
          checked: false,
          label: 'Quality Assurance (QA) and Testing'
        },
        'robotics': {
          checked: false,
          label: 'Robotics'
        },
        'security': {
          checked: false,
          label: 'Security'
        },
        'ux': {
          checked: false,
          label: 'User Experience (UX) Design'
        },
        'ui': {
          checked: false,
          label: 'User Interface (UI) Design'
        },
        'vr': {
          checked: false,
          label: 'Virtual Reality (VR)'
        },
        'web': {
          checked: false,
          label: 'Web Development'
        },
        'windows': {
          checked: false,
          label: 'Windows'
        }
      }
    };

    /*const scripts = ["https://code.jquery.com/jquery-3.2.1.js", "https://cf-4053.kxcdn.com/conversational-form/0.9.6/conversational-form.min.js",null]

    scripts.forEach(link => {
      const script = document.createElement('script');

      if (link) {
        script.src = link;
        script.async = true;
        script.crossOrigin = true;

        document.body.appendChild(script);
      } else {
        window.setTimeout(() => {
          script.text = `new cf.ConversationalForm({formEl: document.getElementById('app-form'), context: document.getElementById('view')});
          document.getElementById('app-form').setAttribute('style', 'display:none');`;

          document.body.appendChild(script);
        }, 50);
      }
    });*/

    firebaseApp.auth().onAuthStateChanged((user) => {
      firebaseApp.database().ref(`userApplications/${user.uid}`).once('value',
        snapshot => {
          if (snapshot) {
            this.setState({ userApplication: { ...this.state.userApplication, ...snapshot.val() } });

            this.state.userApplication.skills.forEach(skill => {
              this.setState({ skillSelection: { ...this.state.skillSelection, [skill]: { ...this.state.skillSelection[skill], checked: true } } });
            });
          } else {
            console.log('User data cannot  be found');
          }
        }, error => {
          console.log('Failed to get user data', error);
        }
      );
    });
  }

  updateSkillSelect(value) {
    const index = this.state.userApplication.skills.indexOf(value);
    
    if (this.state.skillSelection[value].checked) {
      this.state.userApplication.skills.splice(index, 1);

      this.setState({ skillSelection: { ...this.state.skillSelection, [value]: { ...this.state.skillSelection[value], checked: false } } });
    } else {      
      this.state.userApplication.skills.push(value);

      this.setState({ skillSelection: { ...this.state.skillSelection, [value]: { ...this.state.skillSelection[value], checked: true } } });
    }
  }

  submit() {
    const user = firebaseApp.auth().currentUser;

    firebaseApp.database().ref(`userApplications/${user.uid}`).set({
      ...this.state.userApplication
    }).then(() => {
      // Update successful.
      console.log('Updated application info', user);
      
      const messages = document.getElementById('messages');
      const successMsg = document.getElementById('form-success-msg');

      if (messages) {
        if (successMsg) {
          successMsg.setAttribute('style', 'display: block');
        } else {
          ReactDom.render(
            <Bulma.Message success id='form-success-msg'>
              <Bulma.Message.Header>
                <p>Info</p>
                <Bulma.Delete onClick={() => {document.getElementById('form-success-msg').setAttribute('style', 'display: none')}} />
              </Bulma.Message.Header>
              <Bulma.Message.Body>
                <Bulma.Content>Successfully updated your application info.</Bulma.Content>
              </Bulma.Message.Body>
            </Bulma.Message>,
            document.getElementById('messages')
          );
        }
      }
    }).catch(error => {
      // An error happened.
      console.log('Failed to update application info', user);
      
      const messages = document.getElementById('messages');
      const errorMsg = document.getElementById('form-error-msg');

      if (messages) {
        if (errorMsg) {
          errorMsg.setAttribute('style', 'display: block');
        } else {
          ReactDom.render(
            <Bulma.Message danger id='form-error-msg'>
              <Bulma.Message.Header>
                <p>Error</p>
                <Bulma.Delete onClick={() => {document.getElementById('form-error-msg').setAttribute('style', 'display: none')}} />
              </Bulma.Message.Header>
              <Bulma.Message.Body>
                <Bulma.Content>Failed to save application info. Please try again later.</Bulma.Content>
              </Bulma.Message.Body>
            </Bulma.Message>,
            document.getElementById('messages')
          );
        }
      }
    });
  }

  render() {
    return (
      <div>
        <div id="messages"></div>
        <form id='app-form' className="js-form">
          <div className='field'>
            <label htmlFor="firstname" className="label">First Name:</label>
            <div className="control">
              <input id="firstname" className="input" type="text" name="firstname" value={this.state.userApplication.name.first} required
                onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, name: { ...this.state.userApplication.name, first: event.target.value } } })}
                cf-questions="Hi there!&&What is your first name?|Looking to sign up?&&I can help you with that!&&What is your first name?"
              />
            </div>
          </div>

          <div className='field'>
            <label htmlFor="lastname" className="label">Last Name:</label>
            <div className="control">
              <input id="lastname" className="input" type="text" name="lastname" value={this.state.userApplication.name.last} required
                onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, name: { ...this.state.userApplication.name, last: event.target.value } } })}
                cf-questions="Thanks for that {firstname}!&&Also, may I get your last name?|{firstname}, what is your last name?"
              />
            </div>
          </div>

          <div className='field'>
            <label htmlFor="gender" className="label">Gender:</label>
            <div className="control">
              <div className="select">
                <select id="gender" className="select" name="gender" value={this.state.userApplication.gender} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, gender: event.target.value } })}
                  cf-questions="I hope this isn't too personal, but can you tell me your gender?&&If you wish not to say you can just choose other."
                >
                  <option value="male" cf-label="Male">Male</option>
                  <option value="female" cf-label="Female">Female</option>
                  <option value="other" cf-label="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <fieldset>
            <legend>Education:</legend>

            <fieldset cf-questions="You are doing great {firstname}!&&Alright now for some school related questions.&&Are you currently in school or out of school?|You are doing great {firstname}!&&Now I would like to know a bit about your school background.&&Are you currently in school or out of school?">
              <legend>Education Status:</legend>

              <div className="field">
                <div className="control">
                  <label htmlFor="school-status-in" className="radio">
                    <input id="school-status-in" type="radio" value="in-school" name="school-status" checked={this.state.userApplication.education.status === 'in-school'}required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, status: event.target.value } } } )}
                      cf-label="In School"
                    />
                    In School
                  </label>

                  <label htmlFor="school-status-out" className="radio">
                    <input id="school-status-out" type="radio" value="out-of-school" name="school-status" checked={this.state.userApplication.education.status === 'out-of-school'} required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, status: event.target.value } } } )}
                      cf-label="Out of School"
                    />
                    Out of School
                  </label>
                </div>
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="school-name" className="label">Select your school name:</label>
              <div className="control">
                <div className="select">
                  <select id="school-name" name="school-name" value={this.state.userApplication.education.school} required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, school: event.target.value } } } )}
                    cf-questions="What is the name of your school?&&If it's not listed, please select 'Other'."
                  >
                    <option value="Acadia University" cf-label="Acadia University">Acadia University</option>
                    <option value="Algoma University" cf-label="Algoma University">Algoma University</option>
                    <option value="Algonquin College" cf-label="Algonquin College">Algonquin College</option>
                    <option value="Athabasca University" cf-label="Athabasca University">Athabasca University</option>
                    <option value="Bishop's University" cf-label="Bishop's University">Bishop's University</option>
                    <option value="Brandon University" cf-label="Brandon University">Brandon University</option>
                    <option value="Brock University" cf-label="Brock University">Brock University</option>
                    <option value="Cambrian College" cf-label="Cambrian College">Cambrian College</option>
                    <option value="Canadore College" cf-label="Canadore College">Canadore College</option>
                    <option value="Cape Breton University" cf-label="Cape Breton University">Cape Breton University</option>
                    <option value="Capilano University" cf-label="Capilano University">Capilano University</option>
                    <option value="Carleton University" cf-label="Carleton University">Carleton University</option>
                    <option value="Centennial College" cf-label="Centennial College">Centennial College</option>
                    <option value="Collège Boréal" cf-label="Collège Boréal">Collège Boréal</option>
                    <option value="Concordia University" cf-label="Concordia University">Concordia University</option>
                    <option value="Conestoga College" cf-label="Conestoga College">Conestoga College</option>
                    <option value="Confederation College" cf-label="Confederation College">Confederation College</option>
                    <option value="Dalhousie University" cf-label="Dalhousie University">Dalhousie University</option>
                    <option value="Dominican University College" cf-label="Dominican University College">Dominican University College</option>
                    <option value="Durham College" cf-label="Durham College">Durham College</option>
                    <option value="École de technologie supérieure" cf-label="École de technologie supérieure">École de technologie supérieure</option>
                    <option value="École nationale d'administration publique" cf-label="École nationale d'administration publique">École nationale d'administration publique</option>
                    <option value="École Polytechnique de Montréal" cf-label="École Polytechnique de Montréal">École Polytechnique de Montréal</option>
                    <option value="Emily Carr University of Art and Design" cf-label="Emily Carr University of Art and Design">Emily Carr University of Art and Design</option>
                    <option value="Fanshawe College" cf-label="Fanshawe College">Fanshawe College</option>
                    <option value="First Nations University of Canada" cf-label="First Nations University of Canada">First Nations University of Canada</option>
                    <option value="Fleming College" cf-label="Fleming College">Fleming College</option>
                    <option value="George Brown College" cf-label="George Brown College">George Brown College</option>
                    <option value="Georgian College" cf-label="Georgian College">Georgian College</option>
                    <option value="HEC Montréal" cf-label="HEC Montréal">HEC Montréal</option>
                    <option value="Humber College" cf-label="Humber College">Humber College</option>
                    <option value="Institut national de la recherche scientifique" cf-label="Institut national de la recherche scientifique">Institut national de la recherche scientifique</option>
                    <option value="Kwantlen Polytechnic University" cf-label="Kwantlen Polytechnic University">Kwantlen Polytechnic University</option>
                    <option value="La Cité collégiale" cf-label="La Cité collégiale">La Cité collégiale</option>
                    <option value="Lakehead University" cf-label="Lakehead University">Lakehead University</option>
                    <option value="Lambton College" cf-label="Lambton College">Lambton College</option>
                    <option value="Laurentian University" cf-label="Laurentian University">Laurentian University</option>
                    <option value="Loyalist College" cf-label="Loyalist College">Loyalist College</option>
                    <option value="MacEwan University" cf-label="MacEwan University">MacEwan University</option>
                    <option value="McGill University" cf-label="McGill University">McGill University</option>
                    <option value="McMaster University" cf-label="McMaster University">McMaster University</option>
                    <option value="Memorial University of Newfoundland" cf-label="Memorial University of Newfoundland">Memorial University of Newfoundland</option>
                    <option value="Mohawk College" cf-label="Mohawk College">Mohawk College</option>
                    <option value="Mount Allison University" cf-label="Mount Allison University">Mount Allison University</option>
                    <option value="Mount Royal University" cf-label="Mount Royal University">Mount Royal University</option>
                    <option value="Mount Saint Vincent University" cf-label="Mount Saint Vincent University">Mount Saint Vincent University</option>
                    <option value="Niagara College" cf-label="Niagara College">Niagara College</option>
                    <option value="Nipissing University" cf-label="Nipissing University">Nipissing University</option>
                    <option value="Northern College" cf-label="Northern College">Northern College</option>
                    <option value="NSCAD University" cf-label="NSCAD University">NSCAD University</option>
                    <option value="OCAD University" cf-label="OCAD University">OCAD University</option>
                    <option value="Queen's University" cf-label="Queen's University">Queen's University</option>
                    <option value="Royal Military College of Canada" cf-label="Royal Military College of Canada">Royal Military College of Canada</option>
                    <option value="Royal Roads University" cf-label="Royal Roads University">Royal Roads University</option>
                    <option value="Ryerson University" cf-label="Ryerson University">Ryerson University</option>
                    <option value="Saint Francis Xavier University" cf-label="Saint Francis Xavier University">Saint Francis Xavier University</option>
                    <option value="Saint Mary's University" cf-label="Saint Mary's University">Saint Mary's University</option>
                    <option value="Saint Paul University" cf-label="Saint Paul University">Saint Paul University</option>
                    <option value="Sault College" cf-label="Sault College">Sault College</option>
                    <option value="Seneca College" cf-label="Seneca College">Seneca College</option>
                    <option value="Sheridan College" cf-label="Sheridan College">Sheridan College</option>
                    <option value="Simon Fraser University" cf-label="Simon Fraser University">Simon Fraser University</option>
                    <option value="St. Clair College" cf-label="St. Clair College">St. Clair College</option>
                    <option value="St. Lawrence College" cf-label="St. Lawrence College">St. Lawrence College</option>
                    <option value="St. Thomas University" cf-label="St. Thomas University">St. Thomas University</option>
                    <option value="Thompson Rivers University" cf-label="Thompson Rivers University">Thompson Rivers University</option>
                    <option value="Trent University" cf-label="Trent University">Trent University</option>
                    <option value="University College of the North" cf-label="University College of the North">University College of the North</option>
                    <option value="Université de Moncton" cf-label="Université de Moncton">Université de Moncton</option>
                    <option value="Université de Montréal" cf-label="Université de Montréal">Université de Montréal</option>
                    <option value="Université de Saint-Boniface" cf-label="Université de Saint-Boniface">Université de Saint-Boniface</option>
                    <option value="Université de Sherbrooke" cf-label="Université de Sherbrooke">Université de Sherbrooke</option>
                    <option value="Université du Québec à Chicoutimi" cf-label="Université du Québec à Chicoutimi">Université du Québec à Chicoutimi</option>
                    <option value="Université du Québec à Montréal" cf-label="Université du Québec à Montréal">Université du Québec à Montréal</option>
                    <option value="Université du Québec à Rimouski" cf-label="Université du Québec à Rimouski">Université du Québec à Rimouski</option>
                    <option value="Université du Québec à Trois-Rivières" cf-label="Université du Québec à Trois-Rivières">Université du Québec à Trois-Rivières</option>
                    <option value="Université du Québec en Abitibi-Témiscamingue" cf-label="Université du Québec en Abitibi-Témiscamingue">Université du Québec en Abitibi-Témiscamingue</option>
                    <option value="Université du Québec en Outaouais" cf-label="Université du Québec en Outaouais">Université du Québec en Outaouais</option>
                    <option value="Université Laval" cf-label="Université Laval">Université Laval</option>
                    <option value="University of Alberta" cf-label="University of Alberta">University of Alberta</option>
                    <option value="University of British Columbia" cf-label="University of British Columbia">University of British Columbia</option>
                    <option value="University of Calgary" cf-label="University of Calgary">University of Calgary</option>
                    <option value="University of the Fraser Valley" cf-label="University of the Fraser Valley">University of the Fraser Valley</option>
                    <option value="University of Guelph" cf-label="University of Guelph">University of Guelph</option>
                    <option value="University of King's College" cf-label="University of King's College">University of King's College</option>
                    <option value="University of Lethbridge" cf-label="University of Lethbridge">University of Lethbridge</option>
                    <option value="University of Manitoba" cf-label="University of Manitoba">University of Manitoba</option>
                    <option value="University of New Brunswick" cf-label="University of New Brunswick">University of New Brunswick</option>
                    <option value="University of Northern British Columbia" cf-label="University of Northern British Columbia">University of Northern British Columbia</option>
                    <option value="University of Ontario Institute of Technology" cf-label="University of Ontario Institute of Technology">University of Ontario Institute of Technology</option>
                    <option value="University of Ottawa" cf-label="University of Ottawa">University of Ottawa</option>
                    <option value="University of Prince Edward Island" cf-label="University of Prince Edward Island">University of Prince Edward Island</option>
                    <option value="University of Regina" cf-label="University of Regina">University of Regina</option>
                    <option value="University of Saskatchewan" cf-label="University of Saskatchewan">University of Saskatchewan</option>
                    <option value="University of Toronto" cf-label="University of Toronto">University of Toronto</option>
                    <option value="University of Victoria" cf-label="University of Victoria">University of Victoria</option>
                    <option value="University of Waterloo" cf-label="University of Waterloo">University of Waterloo</option>
                    <option value="University of Western Ontario" cf-label="University of Western Ontario">University of Western Ontario</option>
                    <option value="University of Windsor" cf-label="University of Windsor">University of Windsor</option>
                    <option value="University of Winnipeg" cf-label="University of Winnipeg">University of Winnipeg</option>
                    <option value="Université Sainte-Anne" cf-label="Université Sainte-Anne">Université Sainte-Anne</option>
                    <option value="Vancouver Island University" cf-label="Vancouver Island University">Vancouver Island University</option>
                    <option value="Wilfrid Laurier University" cf-label="Wilfrid Laurier University">Wilfrid Laurier University</option>
                    <option value="York University" cf-label="York University">York University</option>            
                    <option value="Other" cf-label="York University">Other</option>            
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="school-name-other" className="label">Enter your school name (if it was not listed):</label>
              <div className="control">
                <input id="school-name-other" className="input" type="text" name="school-name-other" value={this.state.userApplication.education.schoolOther}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, schoolOther: event.target.value } } } )}
                  cf-questions="Ah I see that you have selected 'Other'.&&What is the name of the school you attend or have attended?"
                  cf-conditional-school-name="Other"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="program" className="label">Program name:</label>
              <div className="control">
                <input id="program" className="input" type="text" name="program" value={this.state.userApplication.education.program} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, program: event.target.value } } } )}
                  cf-questions="Nice!&&If you are are highschool student please input 'Highschool Diploma'.&&What program do/did you study?|Awesome!&&If you are are highschool student please input 'Highschool Diploma'.&&What is the name of the program you study/studied?"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="year" className="label">Year of study (if you are in school):</label>
              <div className="control">
                <input id="year" className="input" type="number" name="year" min={1} pattern="^[1-9][0-9]*?$" value={this.state.userApplication.education.year}
                onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, year: event.target.value } } } )}
                cf-questions="{program} is a really cool program!&&What year are you in right now?|{program} is cool!&&Also, what year are you in?" cf-error="That is not a valid year of study.|I don't recognize that as a valid year of study."
                cf-conditional-school-status="in-school"
              />
              </div>
            </div>

          </fieldset>

          <fieldset>
            <legend>Location:</legend>

            <div className="field">
              <label htmlFor="country" className="label">Select your Country:</label>
              <div className="control">
                <div className="select">
                  <select id="country" name="country" value={this.state.userApplication.location.country} required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, country: event.target.value } } } )}
                    cf-questions="Okay {firstname}, what country are you located?&&If you are outside of Canada or United States please select 'Other'."
                  >
                    <option value="Canada" cf-label="Canada">Canada</option>
                    <option value="United States" cf-label="United States">United States</option>
                    <option value="Other" cf-label="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="country-other" className="label">Enter your country name (if it was not listed):</label>
              <div className="control">
                <input id="country-other" className="input" type="text" name="country-other" value={this.state.userApplication.location.countryOther}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, countryOther: event.target.value } } } )}
                  cf-questions="Okay, so you are located outside of Canada and the United States.&&That is cool!&&Which country do you reside in?"
                  cf-conditional-country="Other"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="city" className="label">Enter your City:</label>
              <div className="control">
                <input id="city" className="input" type="text" name="city" value={this.state.userApplication.location.city} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, city: event.target.value } } } )}
                  cf-questions="And your city?|Which city are you in {firstname}?"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Skills and Experience:</legend>

            <fieldset cf-questions="{city} sounds like a nice place to live.&&So {firstname}, what relevant tech experience do you have up your sleeve?&&For clarifcation of UX vs. UI vs. IA vs. IxD please refer to this <a href='https://tristaljing.wordpress.com/2017/09/14/ux-vs-ui-vs-ia-vs-ixd-4-confusing-digital-design-terms-defined' title='UX vs UI vs IA vs IxD : 4 Confusing Digital Design Terms Defined' rel='noreferrer noopener' target='_blank'>article</a>|{city} sounds like a nice place to live.&&What are some experience that you are great at?&&For clarifcation of UX vs. UI vs. IA vs. IxD please refer to this <a href='https://tristaljing.wordpress.com/2017/09/14/ux-vs-ui-vs-ia-vs-ixd-4-confusing-digital-design-terms-defined' title='UX vs UI vs IA vs IxD : 4 Confusing Digital Design Terms Defined' rel='noreferrer noopener' target='_blank'>article</a>">
              <legend>Select your areas of experience:</legend>

              <SkillSelection app={this} />
            </fieldset>

            <div className="field">
              <label htmlFor="portfolio" className="label">Portfolio URL:</label>
              <div className="control">
                <input id="portfolio" className="input" type="url" name="portfolio" pattern="(null)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))"
                  value={this.state.userApplication.experience.portfolio}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, portfolio: event.target.value } } } )}
                  cf-questions="Do you have a portfolio site or some place you show case your work?&&Anything from Dribble, LinkedIn, DevPost, or your own personal site will work.&&This is an optional question, there is no need to provide a url if you don't have a suitable portfolio (type in 'null')."
                  cf-error="Please provide a valid url.|I don't recognize that url format. Please try again."
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="repo" className="label">Repository URL:</label>
              <div className="control">
                <input id="repo" className="input" type="url" name="repo" pattern="(null)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))"
                  value={this.state.userApplication.experience.repo}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, repo: event.target.value } } } )}
                  cf-questions="If you have a github/bitbucket/gitlab repo or a repo from another source, please send me the link here!&&This is an optional question, there is no need to provide a url if you don't have a suitable repository of work (type in 'null')."
                  cf-error="Please provide a valid url.|I don't recognize that url format. Please try again."
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="other" className="label">Other URL:</label>
              <div className="control">
                <input id="other" className="input" type="url" name="other" pattern="(null)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))"
                  value={this.state.userApplication.experience.other}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, other: event.target.value } } } )}
                  cf-questions="If there is anything else that you'd like to share with us, such as a personal blog, drop it below and we will definitely check it out!&&This is an optional question, there is no need to provide a url if you don't have anything else you would like us to see (type in 'null')."
                  cf-error="Please provide a valid url.|I don't recognize that url format. Please try again."
                />
              </div>
            </div>

            {/*<div className="field">
              <label htmlFor="resume" className="label">Resume upload (PDF only):</label>
              <div className="control">
                <input id="resume" className="input" type="file" name="resume" accept=".pdf"
                  value={this.state.userApplication.experience.resume}
                  onChange={(event) => console.log(event)}
                  cf-questions="All hackathons are great ways to get noticed by big time companies, do you want to get noticed?&&Share us a link to your resume and we will pass it along!&&Please upload your resume in PDF format."
                />
              </div>
            </div>*/}
          </fieldset>
          
          <fieldset>
            <legend>Hacking Background:</legend>

            <div className="field">
              <label htmlFor="experience-level" className="label"></label>
              <div className="control">
                <div className="select">
                  <select id="experience-level" name="experience-level" value={this.state.userApplication.hacking.level} required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, level: event.target.value } } } )}
                    cf-questions="How experienced are you with hackathons?|Have you been to many hackathons or is this going to be your first time?|Have you ever experienced a hackathon?" 
                  >
                    <option value="first hack" cf-label="This is my first hackathon">This is my first hackathon</option>
                    <option value="few hacks" cf-label="I have been to one/some before">I have been to one/some before</option>
                    <option value="many hacks" cf-label="I am a hackathon veteran">I am a hackathon veteran</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="why-attend" className="label">Why do you want to attend RU Hacks?</label>
              <div className="control">
                <textarea id="why-attend" className="textarea" name="why-attend" value={this.state.userApplication.hacking.whyAttend} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, whyAttend: event.target.value } } } )}
                  cf-questions="{firstname} it is time for some longer questions.&&First off, why do you want to attend RU Hacks?"
                  cf-error="We would be interested in hearing your reason so please share. :D"
                ></textarea>
              </div>
            </div>

            <div className="field">
              <label htmlFor="creation-proud-of" className="label">What is something you have worked on that you are most proud of?</label>
              <div className="control">
                <textarea id="creation-proud-of" className="textarea" name="creation-proud-of" value={this.state.userApplication.hacking.creation} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, creation: event.target.value } } } )}
                  cf-questions="Sounds awesome!&&Now what is something that you created that you are most proud of?|That sounds good.&&Now can you tell me about something you created that you are proud of?"
                  cf-error="Please! It would let us get to know you better. :)"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Do you agree to MLH Code of Conduct? (Can be found <a href="http://static.mlh.io/docs/mlh-code-of-conduct.pdf" title="MLH Code of Conduct" rel="noreferrer noopener" target="_blank">here</a>)</legend>

            <input id="agree-to-terms" type="checkbox" value="yes" name="agree-to-terms" checked={this.state.userApplication.mlh} required
              onClick={(event) => this.setState({ userApplication: { ...this.state.userApplication, mlh: event.target.checked } } )}
              cf-questions="Finally, do you agree with the MLH <a href='http://static.mlh.io/docs/mlh-code-of-conduct.pdf' title='MLH Code of Conduct' rel='noreferrer noopener' target='_target'>Code of Conduct</a>?"
              cf-error="Please agree with the Code of Conduct otherwise we cannot proceed."
            />
            <label htmlFor="agree-to-terms">Yes</label>
          </fieldset>

          <Bulma.Button className='button is-link' onClick={(event) => {event.preventDefault(); this.submit();}}>
            Save Application
          </Bulma.Button>
          {/*<input id="submit" type="text" value="bye" name="submit" pattern="^bye$" cf-questions="Thanks for your info.&&We will contact you soon!&&Enter in 'bye' to finish sign up."
            onChange={event => console.log(event)}
          />*/}
        </form>
      </div>
    );
  }
}

export default Application;
