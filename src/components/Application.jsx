import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { firebaseApp } from '../firebase';
import * as Bulma from 'reactbulma';

const initialValidInputState = {
  'name.first': '',
  'name.last': '',
  gender: '',
  'education.status': '',
  'education.school': '',
  'education.schoolOther': '',
  'education.program': '',
  'education.year': '',
  'location.country': '',
  'location.countryOther': '',
  'location.city': '',
  skills: '',
  'experience.portfolio': '',
  'experience.repo': '',
  'experience.other': '',
  'experience.resume': '',
  'hacking.level': '',
  'hacking.whyAttend': '',
  'hacking.creation': '',
  mlh: '',
};

function SchoolList(props) {
  const schools = props.app.state.schools;
  const schoolEl = [];

  schools.forEach((school, index) => {
    schoolEl.push(
      <option value={school} cf-label={school} key={index}>{school}</option>
    );
  });

  return (schoolEl.length > 0 ? schoolEl : null);
}

function SkillSelection(props) {
  const skills = props.app.state.skillSelection;
  const skillEl = [];

  Object.keys(skills).forEach((skill, index) => {
    skillEl.push(
      <div className='control' key={index}>
        <label htmlFor={`experience-${skill}`} className='checkbox'>
          <input id={`experience-${skill}`} type='checkbox' value={skill} name='experience'
            checked={skills[skill].checked}
            onChange={(event) => {
              props.app.updateSkillSelect(skill);
              props.app.setState({ validInput: { ...props.app.state.validInput, skills: '' } });
            }}
          />
          <span className={`tag is-rounded is-medium ${skills[skill].checked ? 'is-primary' : ''} ${props.app.state.validInput.skills}`}>{skills[skill].label}</span>
        </label>
      </div>
  );
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
        gender: 'male',
        education: {
          status: 'in-school',
          school: 'Acadia University',
          schoolOther: '',
          program: '',
          year: 0,
        },
        location: {
          country: 'Canada',
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
          level: 'first hack',
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
      },
      schools: [
        'Acadia University',
        'Algoma University',
        'Algonquin College',
        'Athabasca University',
        'Bishop\'s University',
        'Brandon University',
        'Brock University',
        'Cambrian College',
        'Canadore College',
        'Cape Breton University',
        'Capilano University',
        'Carleton University',
        'Centennial College',
        'Collège Boréal',
        'Concordia University',
        'Conestoga College',
        'Confederation College',
        'Dalhousie University',
        'Dominican University College',
        'Durham College',
        'École de technologie supérieure',
        'École nationale d\'administration publique',
        'École Polytechnique de Montréal',
        'Emily Carr University of Art and Design',
        'Fanshawe College',
        'First Nations University of Canada',
        'Fleming College',
        'George Brown College',
        'Georgian College',
        'HEC Montréal',
        'Humber College',
        'Institut national de la recherche scientifique',
        'Kwantlen Polytechnic University',
        'La Cité collégiale',
        'Lakehead University',
        'Lambton College',
        'Laurentian University',
        'Loyalist College',
        'MacEwan University',
        'McGill University',
        'McMaster University',
        'Memorial University of Newfoundland',
        'Mohawk College',
        'Mount Allison University',
        'Mount Royal University',
        'Mount Saint Vincent University',
        'Niagara College',
        'Nipissing University',
        'Northern College',
        'NSCAD University',
        'OCAD University',
        'Queen\'s University',
        'Royal Military College of Canada',
        'Royal Roads University',
        'Ryerson University',
        'Saint Francis Xavier University',
        'Saint Mary\'s University',
        'Saint Paul University',
        'Sault College',
        'Seneca College',
        'Sheridan College',
        'Simon Fraser University',
        'St. Clair College',
        'St. Lawrence College',
        'St. Thomas University',
        'Thompson Rivers University',
        'Trent University',
        'University College of the North',
        'Université de Moncton',
        'Université de Montréal',
        'Université de Saint-Boniface',
        'Université de Sherbrooke',
        'Université du Québec à Chicoutimi',
        'Université du Québec à Montréal',
        'Université du Québec à Rimouski',
        'Université du Québec à Trois-Rivières',
        'Université du Québec en Abitibi-Témiscamingue',
        'Université du Québec en Outaouais',
        'Université Laval',
        'University of Alberta',
        'University of British Columbia',
        'University of Calgary',
        'University of the Fraser Valley',
        'University of Guelph',
        'University of King\'s College',
        'University of Lethbridge',
        'University of Manitoba',
        'University of New Brunswick',
        'University of Northern British Columbia',
        'University of Ontario Institute of Technology',
        'University of Ottawa',
        'University of Prince Edward Island',
        'University of Regina',
        'University of Saskatchewan',
        'University of Toronto',
        'University of Victoria',
        'University of Waterloo',
        'University of Western Ontario',
        'University of Windsor',
        'University of Winnipeg',
        'Université Sainte-Anne',
        'Vancouver Island University',
        'Wilfrid Laurier University',
        'York University',
        'Other',
      ],
      validInput: { ...initialValidInputState }
    };

    /*const scripts = ['https://code.jquery.com/jquery-3.2.1.js', 'https://cf-4053.kxcdn.com/conversational-form/0.9.6/conversational-form.min.js',null]

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
            // console.log('User data cannot  be found');
          }
        }, error => {
          // console.log('Failed to get user data', error);
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

  resetErrors() {
    Object.keys(this.state.validInput).forEach(input => {
      if (this.state.validInput[input].trim() !== '') {
        delete this.state.validInput[input];
      }
    });

    this.setState({ validInput: { ...initialValidInputState } });
  }

  validatedInput() {
    const optional = ['education.schoolOther', 'location.countryOther', 'experience.repo', 'experience.other', 'experience.resume'];
    const inputs = Object.keys(this.state.validInput);
    let endValidation = false;
    let index = 0;
    let input = inputs[index];

    this.resetErrors()

    while(index < inputs.length && !endValidation) {
      let path = input.split('.');
      let field = this.state.userApplication;

      path.forEach(part => {
        field = field[part];
      });

      switch((typeof field).toLowerCase()) {
        case 'boolean':
          if (field === false && input === 'mlh') {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } });
            endValidation = true;
          }
          break;
        case 'number':
          break;
        case 'string':
          if (field.trim() === '' && optional.indexOf(input) < 0) {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } });
            endValidation = true;
          }
          break;
        case 'object':
          if (Array.isArray(field) && field.length < 1) {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } });
            endValidation = true;
          }
          break;
        default:
          // do nothing
          break;
      }

      input = inputs[++index];
    }

    return !endValidation;
  }

  submit() {
    if (this.validatedInput()) {
      const user = firebaseApp.auth().currentUser;

      firebaseApp.database().ref(`userApplications/${user.uid}`).set({
        ...this.state.userApplication
      }).then(() => {
        // Update successful.
        // console.log('Updated application info', user);
        
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

        firebaseApp.database().ref(`users/${user.uid}`).once('value', snapshot => {
          if (snapshot) {
            firebaseApp.database().ref(`users/${user.uid}`).set({
              ...snapshot.val(),
              applicationComplete: true,
            }).then(() => {
              // success
            }).catch(error => {
              // error
            });
          }
        });
      }).catch(error => {
        // An error happened.
        // console.log('Failed to update application info', user);
        
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
    } else {
      const messages = document.getElementById('messages');
      const errorMsg = document.getElementById('form-validation-error-msg');

      if (messages) {
        if (errorMsg) {
          errorMsg.setAttribute('style', 'display: block');
        } else {
          ReactDom.render(
            <Bulma.Message danger id='form-validation-error-msg'>
              <Bulma.Message.Header>
                <p>Error</p>
                <Bulma.Delete onClick={() => {document.getElementById('form-validation-error-msg').setAttribute('style', 'display: none')}} />
              </Bulma.Message.Header>
              <Bulma.Message.Body>
                <Bulma.Content>Failed to save application info. There are either missing inputs or invalid inputs provided. Please check your application again.</Bulma.Content>
              </Bulma.Message.Body>
            </Bulma.Message>,
            document.getElementById('messages')
          );
        }
      }
    }
  }

  render() {
    return (
      <div>
        <div id='messages'></div>
        <form id='app-form' className='js-form'>
          <div className='columns'>
            <div className='field column is-half'>
              <label htmlFor='firstname' className='label'>First Name:</label>
              <div className='control'>
                <input id='firstname' className={`input ${this.state.validInput['name.first']}`} type='text' name='firstname' value={this.state.userApplication.name.first} placeholder='Foo' required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, name: { ...this.state.userApplication.name, first: event.target.value } } })}
                  cf-questions='Hi there!&&What is your first name?|Looking to sign up?&&I can help you with that!&&What is your first name?'
                />
              </div>
            </div>

            <div className='field column is-half'>
              <label htmlFor='lastname' className='label'>Last Name:</label>
              <div className='control'>
                <input id='lastname' className={`input ${this.state.validInput['name.last']}`} type='text' name='lastname' value={this.state.userApplication.name.last} placeholder='Baz' required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, name: { ...this.state.userApplication.name, last: event.target.value } } })}
                  cf-questions='Thanks for that {firstname}!&&Also, may I get your last name?|{firstname}, what is your last name?'
                />
              </div>
            </div>
          </div>

          <div className='field'>
            <label htmlFor='gender' className='label'>Gender:</label>
            <div className='control'>
              <div className={`select ${this.state.validInput.gender}`}>
                <select id='gender' name='gender' value={this.state.userApplication.gender} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, gender: event.target.value } })}
                  cf-questions={'I hope this isn\'t too personal, but can you tell me your gender?&&If you wish not to say you can just choose other.'}
                >
                  <option value='male' cf-label='Male'>Male</option>
                  <option value='female' cf-label='Female'>Female</option>
                  <option value='other' cf-label='Other'>Other</option>
                </select>
              </div>
            </div>
          </div>

          <fieldset>
            <legend>Education:</legend>

            <fieldset cf-questions='You are doing great {firstname}!&&Alright now for some school related questions.&&Are you currently in school or out of school?|You are doing great {firstname}!&&Now I would like to know a bit about your school background.&&Are you currently in school or out of school?'>
              <legend className='label'>Select your Education Status:</legend>

              <div className='field'>
                <div className='control'>
                  <label htmlFor='school-status-in' className={`radio tag is-medium ${this.state.userApplication.education.status === 'in-school' ? 'is-primary' : ''} ${this.state.validInput['education.status']}`}>
                    <input id='school-status-in' type='radio' value='in-school' name='school-status' checked={this.state.userApplication.education.status === 'in-school'} required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, status: event.target.value } } } )}
                      cf-label='In School'
                    />
                    In School
                  </label>

                  <label htmlFor='school-status-out' className={`radio tag is-medium ${this.state.userApplication.education.status === 'out-of-school' ? 'is-primary' : ''} ${this.state.validInput['education.status']}`}>
                    <input id='school-status-out' type='radio' value='out-of-school' name='school-status' checked={this.state.userApplication.education.status === 'out-of-school'} required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, status: event.target.value } } } )}
                      cf-label='Out of School'
                    />
                    Out of School
                  </label>
                </div>
              </div>
            </fieldset>

            <div className='columns'>
              <div className='field column is-half'>
                <label htmlFor='school-name' className='label'>Select your School:</label>
                <div className='control'>
                  <div className={`select is-fullwidth ${this.state.validInput['education.school']}`}>
                    <select id='school-name' name='school-name' value={this.state.userApplication.education.school} required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, school: event.target.value } } } )}
                      cf-questions={'What is the name of your school?&&If it\'s not listed, please select \'Other\'.'}
                    >
                      <SchoolList app={this} />
                    </select>
                  </div>
                </div>
              </div>

              <div className='field column is-half'>
                <label htmlFor='school-name-other' className='label'>School (if not listed):</label>
                <div className='control'>
                  <input id='school-name-other' className={`input ${this.state.validInput['education.schoolOther']}`} type='text' name='school-name-other' value={this.state.userApplication.education.schoolOther}
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, schoolOther: event.target.value } } } )}
                    cf-questions={'Ah I see that you have selected \'Other\'.&&What is the name of the school you attend or have attended?'}
                    cf-conditional-school-name='Other'
                  />
                </div>
              </div>
            </div>

            <div className='columns'>
              <div className='field column is-half'>
                <label htmlFor='program' className='label'>Program name:</label>
                <div className='control'>
                  <input id='program' className={`input ${this.state.validInput['education.program']}`} type='text' name='program' value={this.state.userApplication.education.program} placeholder={'If you are in highschool, put \'Highschool Diploma\'.'} required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, program: event.target.value } } } )}
                    cf-questions={'Nice!&&If you are are highschool student please input \'Highschool Diploma\'.&&What program do/did you study?|Awesome!&&If you are are highschool student please input \'Highschool Diploma\'.&&What is the name of the program you study/studied?'}
                  />
                </div>
              </div>

              <div className='field column is-half'>
                <label htmlFor='year' className='label'>Year of study (if in school else 0):</label>
                <div className='control'>
                  <input id='year' className={`input ${this.state.validInput['education.year']}`} type='number' name='year' min={0} pattern='^[0-9][0-9]*?$' value={this.state.userApplication.education.year}
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, education: { ...this.state.userApplication.education, year: parseInt(event.target.value, 10) } } } )}
                  cf-questions='{program} is a really cool program!&&What year are you in right now?|{program} is cool!&&Also, what year are you in?'
                  cf-error={'That is not a valid year of study.|I don\'t recognize that as a valid year of study.'}
                  cf-conditional-school-status='in-school'
                />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Location:</legend>

            <div className='columns'>
              <div className='field column is-one-third'>
                <label htmlFor='country' className='label'>Select your Country:</label>
                <div className='control'>
                  <div className={`select is-fullwidth ${this.state.validInput['location.country']}`}>
                    <select id='country' name='country' value={this.state.userApplication.location.country} required
                      onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, country: event.target.value } } } )}
                      cf-questions={'Okay {firstname}, what country are you located?&&If you are outside of Canada or United States please select \'Other\'.'}
                    >
                      <option value='Canada' cf-label='Canada'>Canada</option>
                      <option value='United States' cf-label='United States'>United States</option>
                      <option value='Other' cf-label='Other'>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='field column is-one-third'>
                <label htmlFor='country-other' className='label'>Country (if not listed):</label>
                <div className='control'>
                  <input id='country-other' className={`input ${this.state.validInput['location.countryOther']}`} type='text' name='country-other' value={this.state.userApplication.location.countryOther}
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, countryOther: event.target.value } } } )}
                    cf-questions='Okay, so you are located outside of Canada and the United States.&&That is cool!&&Which country do you reside in?'
                    cf-conditional-country='Other'
                  />
                </div>
              </div>

              <div className='field column is-one-third'>
                <label htmlFor='city' className='label'>Enter your City:</label>
                <div className='control'>
                  <input id='city' className={`input ${this.state.validInput['location.city']}`} type='text' name='city' value={this.state.userApplication.location.city} placeholder='Toronto' required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, location: { ...this.state.userApplication.location, city: event.target.value } } } )}
                    cf-questions='And your city?|Which city are you in {firstname}?'
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Skills and Experience:</legend>

            <fieldset cf-questions={'{city} sounds like a nice place to live.&&So {firstname}, what relevant tech experience do you have up your sleeve?&&For clarifcation of UX vs. UI vs. IA vs. IxD please refer to this <a href=\'https://tristaljing.wordpress.com/2017/09/14/ux-vs-ui-vs-ia-vs-ixd-4-confusing-digital-design-terms-defined\' title=\'UX vs UI vs IA vs IxD : 4 Confusing Digital Design Terms Defined\' rel=\'noreferrer noopener\' target=\'_blank\'>article</a>|{city} sounds like a nice place to live.&&What are some experience that you are great at?&&For clarifcation of UX vs. UI vs. IA vs. IxD please refer to this <a href=\'https://tristaljing.wordpress.com/2017/09/14/ux-vs-ui-vs-ia-vs-ixd-4-confusing-digital-design-terms-defined\' title=\'UX vs UI vs IA vs IxD : 4 Confusing Digital Design Terms Defined\' rel=\'noreferrer noopener\' target=\'_blank\'>article</a>'}>
              <legend className='label'>Select your areas of experience:</legend>

              <div className='field is-grouped is-grouped-multiline tag-selection'>
                <SkillSelection app={this} />
              </div>
            </fieldset>

            <div className='columns'>
              <div className='field column is-half'>
                <label htmlFor='portfolio' className='label'>Portfolio URL:</label>
                <div className='control'>
                  <input id='portfolio' className={`input ${this.state.validInput['experience.portfolio']}`} type='url' name='portfolio'
                    pattern='https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)' placeholder='http:\\foo.baz' required
                    value={this.state.userApplication.experience.portfolio}
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, portfolio: event.target.value } } } )}
                    cf-questions={'Do you have a portfolio site or some place you show case your work?&&Anything from Dribble, LinkedIn, DevPost, or your own personal site will work.'}
                    cf-error={'Please provide a valid url.|I don\'t recognize that url format. Please try again.'}
                  />
                </div>
              </div>

              <div className='field column is-half'>
                <label htmlFor='repo' className='label'>Repository URL (Optional):</label>
                <div className='control'>
                  <input id='repo' className={`input ${this.state.validInput['experience.repo']}`} type='url' name='repo'
                    pattern='(null)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))' placeholder='http:\\foo.baz'
                    value={this.state.userApplication.experience.repo}
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, repo: event.target.value } } } )}
                    cf-questions={'If you have a github/bitbucket/gitlab repo or a repo from another source, please send me the link here!&&This is an optional question, there is no need to provide a url if you don\'t have a suitable repository of work (type in \'null\').'}
                    cf-error={'Please provide a valid url.|I don\'t recognize that url format. Please try again.'}
                  />
                </div>
              </div>
            </div>

            <div className='columns'>
              <div className='field column is-half'>
                <label htmlFor='other' className='label'>Other URL (Optional):</label>
                <div className='control'>
                  <input id='other' className={`input ${this.state.validInput['experience.other']}`} type='url' name='other'
                    pattern='(null)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))' placeholder='http:\\foo.baz'
                    value={this.state.userApplication.experience.other}
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, experience: { ...this.state.userApplication.experience, other: event.target.value } } } )}
                    cf-questions={'If there is anything else that you\'d like to share with us, such as a personal blog, drop it below and we will definitely check it out!&&This is an optional question, there is no need to provide a url if you don\'t have anything else you would like us to see (type in \'null\').'}
                    cf-error={'Please provide a valid url.|I don\'t recognize that url format. Please try again.'}
                  />
                </div>
              </div>

              <div className='file has-name column is-half'>
                {/*<div className='label'>Resume upload (PDF only)</div>
                <label htmlFor='resume' className='file-label'>
                  <input id='resume' className='file-input' type='file' name='resume' accept='.pdf'
                    value={this.state.userApplication.experience.resume}
                    onChange={(event) => console.log(event)}
                    cf-questions='All hackathons are great ways to get noticed by big time companies, do you want to get noticed?&&Share us a link to your resume and we will pass it along!&&Please upload your resume in PDF format.'
                  />
                  <span className='file-cta'>
                    <span className='file-icon'>
                      <i className='fa fa-upload'></i>
                    </span>
                    <span className='file-label'>Choose a file...</span>
                  </span>
                  <span className='file-name'></span>
                </label>*/}
              </div>
            </div>
          </fieldset>
          
          <fieldset>
            <legend>Hacking Background:</legend>

            <div className='field'>
              <label htmlFor='experience-level' className='label'>Level of Experience:</label>
              <div className='control'>
                <div className={`select ${this.state.validInput['hacking.level']}`}>
                  <select id='experience-level' name='experience-level' value={this.state.userApplication.hacking.level} required
                    onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, level: event.target.value } } } )}
                    cf-questions='How experienced are you with hackathons?|Have you been to many hackathons or is this going to be your first time?|Have you ever experienced a hackathon?' 
                  >
                    <option value='first hack' cf-label='This is my first hackathon'>This is my first hackathon</option>
                    <option value='few hacks' cf-label='I have been to one/some before'>I have been to one/some before</option>
                    <option value='many hacks' cf-label='I am a hackathon veteran'>I am a hackathon veteran</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='why-attend' className='label'>Why do you want to attend RU Hacks?</label>
              <div className='control'>
                <textarea id='why-attend' className={`textarea ${this.state.validInput['hacking.whyAttend']}`} name='why-attend' value={this.state.userApplication.hacking.whyAttend} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, whyAttend: event.target.value } } } )}
                  cf-questions='{firstname} it is time for some longer questions.&&First off, why do you want to attend RU Hacks?'
                  cf-error='We would be interested in hearing your reason so please share. :D'
                ></textarea>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='creation-proud-of' className='label'>What is something you have worked on that you are most proud of?</label>
              <div className='control'>
                <textarea id='creation-proud-of' className={`textarea ${this.state.validInput['hacking.creation']}`} name='creation-proud-of' value={this.state.userApplication.hacking.creation} required
                  onChange={(event) => this.setState({ userApplication: { ...this.state.userApplication, hacking: { ...this.state.userApplication.hacking, creation: event.target.value } } } )}
                  cf-questions='Sounds awesome!&&Now what is something that you created that you are most proud of?|That sounds good.&&Now can you tell me about something you created that you are proud of?'
                  cf-error='Please! It would let us get to know you better. :)'
                ></textarea>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Do you agree to MLH Code of Conduct? (Can be found <a href='http://static.mlh.io/docs/mlh-code-of-conduct.pdf' title='MLH Code of Conduct' rel='noreferrer noopener' target='_blank'>here</a>)</legend>

            <p className='content'><strong>I agree to the terms of both the MLH <a href='https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md' title='MLH Contest Terms'  rel='noreferrer noopener' target='_blank'>Contest Terms and Conditions</a> as well as the MLH <a href='https://github.com/MLH/mlh-policies/blob/master/privacy-policy.md' title='MLH Privacy Policy' rel='noreferrer noopener' target='_blank'>Privacy Policy</a>. Please note that you may receive pre and post-event informational e-mails as well as occasional messages about hackathons from MLH as per the MLH Privacy Policy.</strong></p>
            <div className={`tag is-medium ${this.state.userApplication.mlh ? 'is-success' : 'is-danger'}`} style={{cursor: 'pointer'}}>
              <label htmlFor='agree-to-terms'>
                <input id='agree-to-terms' type='checkbox' value='yes' name='agree-to-terms' checked={this.state.userApplication.mlh} required
                  onClick={() => this.setState({ userApplication: { ...this.state.userApplication, mlh: !this.state.userApplication.mlh } } )}
                  cf-questions={'Finally, do you agree with the MLH <a href=\'http://static.mlh.io/docs/mlh-code-of-conduct.pdf\' title=\'MLH Code of Conduct\' rel=\'noreferrer noopener\' target=\'_target\'>Code of Conduct</a>; <a href=\'https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md\' title=\'MLH Contest Terms\'  rel=\'noreferrer noopener\' target=\'_blank\'>Contest Terms and Conditions</a>; and <a href=\'https://github.com/MLH/mlh-policies/blob/master/privacy-policy.md\' title=\'MLH Privacy Policy\' rel=\'noreferrer noopener\' target=\'_blank\'>Privacy Policy</a>?'}
                  cf-error='Please agree with the Code of Conduct otherwise we cannot proceed.'
                />
                Yes
              </label>
              <span
                onClick={() => this.setState({ userApplication: { ...this.state.userApplication, mlh: !this.state.userApplication.mlh } } )}
              >, I agree with the MLH <a className='has-text-warning' href='http://static.mlh.io/docs/mlh-code-of-conduct.pdf' title='MLH Code of Conduct' rel='noreferrer noopener' target='_blank'>Code of Conduct</a>; <a className='has-text-warning' href='https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md' title='MLH Contest Terms'  rel='noreferrer noopener' target='_blank'>Contest Terms and Conditions</a>; and <a className='has-text-warning' href='https://github.com/MLH/mlh-policies/blob/master/privacy-policy.md' title='MLH Privacy Policy' rel='noreferrer noopener' target='_blank'>Privacy Policy</a></span>
            </div>
          </fieldset>

          <Bulma.Button className='button is-link' onClick={(event) => {event.preventDefault(); this.submit();}}>
            Save Application
          </Bulma.Button>

          {/*<input id='submit' type='text' value='bye' name='submit' pattern='^bye$' cf-questions={'Thanks for your info.&&We will contact you soon!&&Enter in \'bye\' to finish sign up.'}
            onChange={event => console.log(event)}
          />*/}
        </form>
      </div>
    );
  }
}

export default Application;
