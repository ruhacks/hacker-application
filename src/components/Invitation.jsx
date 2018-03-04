import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { firebaseApp } from '../firebase'
import * as Bulma from 'reactbulma'
import * as _uuid from 'uuid'

const initialValidInputState = {
  'dietaryRestrictions.has': '',
  'dietaryRestrictions.string': '',
  hardware: '',
  additionalComments: '',
  attending: '',
  'name.first': '',
  gender: '',
  skills: ''
}

function SkillSelection (props) {
  const skills = props.app.state.skillSelection
  const skillEl = []

  Object.keys(skills).forEach((skill, index) => {
    skillEl.push(
      <div className='control' key={index}>
        <label htmlFor={`experience-${skill}`} className='checkbox'>
          <input
            id={`experience-${skill}`}
            type='checkbox'
            value={skill}
            name='experience'
            checked={skills[skill].checked}
            onChange={event => {
              props.app.updateSkillSelect(skill)
              props.app.setState({ validInput: { ...props.app.state.validInput, skills: '' } })
            }}
          />
          <span
            className={`tag is-rounded is-medium ${skills[skill].checked ? 'is-primary' : ''} ${
              props.app.state.validInput.skills
            }`}
          >
            {skills[skill].label}
          </span>
        </label>
      </div>
    )
  })

  return skillEl.length > 0 ? skillEl : null
}

// ====== Start Deep Merging ======

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

// ====== End Deep Merging ======

class Invitation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userApplication: {
        attending: null,
        dietaryRestrictions: {
          has: false,
          string: '',
        },
        additionalComments: '',
        name: {
          first: '',
        },
        gender: 'male',
        skills: [],
      },
      skillSelection: {
        analytics: {
          checked: false,
          label: 'Analytics'
        },
        android: {
          checked: false,
          label: 'Android'
        },
        ar: {
          checked: false,
          label: 'Augmented Reality (AR)'
        },
        dba: {
          checked: false,
          label: 'Database Administration (DBA)'
        }
      },
      validInput: { ...initialValidInputState },
    }

    this.handleFilename = (file) => {
      this.setState({
        userApplication: {
          ...this.state.userApplication,
          experience: {
            ...this.state.userApplication.experience,
            resume: file.name,
          }
        }
      })

      return (0, _uuid.v4)()
    }

    this.handleUploadStart = () => {
      this.setState({ isUploading: true, progress: 0 })
    }

    this.handleProgress = (progress) => {
      this.setState({ progress })
    }

    this.handleUploadError = (error) => {
      this.setState({
        userApplication: {
          ...this.state.userApplication,
          experience: {
            ...this.state.userApplication.experience,
            resume: this.state.resumeBkup.resume,
            resumeUID: this.state.resumeBkup.resumeUID,
            resumeURL: this.state.resumeBkup.resumeURL,
          }
        },
        progress: 0,
        isUploading: false,
      })
      window.alert('Failed to save your resume. Try again later.')
      // console.error(error);
    }

    this.handleUploadSuccess = (filename) => {
      this.setState({
        userApplication: {
          ...this.state.userApplication,
          experience: {
            ...this.state.userApplication.experience,
            resumeUID: filename,
          }
        },
        progress: 100,
        isUploading: false,
        unsaved: true,
      })

      const clearProgress = window.setTimeout(() => {
        this.setState({ progress: 0 })
        window.clearTimeout(clearProgress)
      }, 5000)

      firebaseApp
        .storage()
        .ref('resumes')
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({
          userApplication: {
            ...this.state.userApplication,
            experience: {
              ...this.state.userApplication.experience,
              resumeURL: url,
            }
          }
        }))
    }

    firebaseApp.auth().onAuthStateChanged((user) => {
      firebaseApp
        .database()
        .ref(`userApplications/${user.uid}`)
        .once(
          'value',
          (snapshot) => {
            if (snapshot.val()) {
              this.setState({
                resumeBkup: {
                  resume: snapshot.val().experience.resume || '',
                  resumeUID: snapshot.val().experience.resumeUID || '',
                  resumeURL: snapshot.val().experience.resumeURL || '',
                }
              })

              this.setState({
                userApplication: mergeDeep(Object.assign({}, this.state.userApplication), snapshot.val())
              })

              this.state.userApplication.skills.forEach((skill) => {
                this.setState({
                  skillSelection: {
                    ...this.state.skillSelection,
                    [skill]: { ...this.state.skillSelection[skill], checked: true }
                  }
                })
              })
            } else {
              // console.log('User data cannot  be found');
            }
          },
          (error) => {
            // console.log('Failed to get user data', error);
          }
        )
    })
  }

  updateSkillSelect (value) {
    const index = this.state.userApplication.skills.indexOf(value)

    if (this.state.skillSelection[value].checked) {
      this.state.userApplication.skills.splice(index, 1)

      this.setState({
        skillSelection: {
          ...this.state.skillSelection,
          [value]: { ...this.state.skillSelection[value], checked: false }
        }
      })
    } else {
      this.state.userApplication.skills.push(value)

      this.setState({
        skillSelection: {
          ...this.state.skillSelection,
          [value]: { ...this.state.skillSelection[value], checked: true }
        }
      })
    }
  }

  resetErrors () {
    Object.keys(this.state.validInput).forEach(input => {
      if (this.state.validInput[input].trim() !== '') {
        delete this.state.validInput[input]
      }
    })

    this.setState({ validInput: { ...initialValidInputState } })
  }

  validatedInput () {
    const optional = [
      'education.schoolOther',
      'location.countryOther',
      'experience.portfolio',
      'experience.repo',
      'experience.other',
    ]
    const inputs = Object.keys(this.state.validInput)
    let endValidation = false
    let index = 0
    let input = inputs[index]

    this.resetErrors()

    while (index < inputs.length && !endValidation) {
      let path = input.split('.')
      let field = this.state.userApplication

      path.forEach(part => {
        field = field[part]
      })

      switch ((typeof field).toLowerCase()) {
        case 'boolean':
          if (field === false && input === 'mlh') {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } })
            endValidation = true
          }
          break
        case 'number':
          break
        case 'string':
          if (field.trim() === '' && optional.indexOf(input) < 0) {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } })
            endValidation = true
          }
          break
        case 'object':
          if (Array.isArray(field) && field.length < 1) {
            this.setState({ validInput: { ...this.state.validInput, [input]: 'is-danger' } })
            endValidation = true
          }
          break
        default:
          // do nothing
          break
      }

      input = inputs[++index]
    }

    return !endValidation
  }

  submit () {
    if (this.validatedInput()) {
      const user = firebaseApp.auth().currentUser

      firebaseApp
        .database()
        .ref(`userApplications/${user.uid}`)
        .set({
          ...this.state.userApplication
        })
        .then(() => {
          // Update successful.
          // console.log('Updated application info', user);

          const messages = document.getElementById('messages')
          const successMsg = document.getElementById('form-success-msg')

          if (messages) {
            if (successMsg) {
              successMsg.setAttribute('style', 'display: block')
            } else {
              ReactDom.render(
                <Bulma.Message success id='form-success-msg'>
                  <Bulma.Message.Header>
                    <p>Info</p>
                    <Bulma.Delete
                      onClick={() => {
                        document
                          .getElementById('form-success-msg')
                          .setAttribute('style', 'display: none')
                      }}
                    />
                  </Bulma.Message.Header>
                  <Bulma.Message.Body>
                    <Bulma.Content>Successfully updated your application info.</Bulma.Content>
                  </Bulma.Message.Body>
                </Bulma.Message>,
                document.getElementById('messages')
              )
            }
          }

          this.setState({ unsaved: false })

          firebaseApp
            .database()
            .ref(`users/${user.uid}`)
            .once('value', snapshot => {
              if (snapshot) {
                firebaseApp
                  .database()
                  .ref(`users/${user.uid}`)
                  .set({
                    ...snapshot.val(),
                    applicationComplete: true
                  })
                  .then(() => {
                    // success
                  })
                  .catch(error => {
                    // error
                  })
              }
            })
        })
        .catch(error => {
          // An error happened.
          // console.log('Failed to update application info', user);

          const messages = document.getElementById('messages')
          const errorMsg = document.getElementById('form-error-msg')

          if (messages) {
            if (errorMsg) {
              errorMsg.setAttribute('style', 'display: block')
            } else {
              ReactDom.render(
                <Bulma.Message danger id='form-error-msg'>
                  <Bulma.Message.Header>
                    <p>Error</p>
                    <Bulma.Delete
                      onClick={() => {
                        document
                          .getElementById('form-error-msg')
                          .setAttribute('style', 'display: none')
                      }}
                    />
                  </Bulma.Message.Header>
                  <Bulma.Message.Body>
                    <Bulma.Content>
                      Failed to save application info. Please try again later.
                    </Bulma.Content>
                  </Bulma.Message.Body>
                </Bulma.Message>,
                document.getElementById('messages')
              )
            }
          }
        })
    } else {
      const messages = document.getElementById('messages')
      const errorMsg = document.getElementById('form-validation-error-msg')

      if (messages) {
        if (errorMsg) {
          errorMsg.setAttribute('style', 'display: block')
        } else {
          ReactDom.render(
            <Bulma.Message danger id='form-validation-error-msg'>
              <Bulma.Message.Header>
                <p>Error</p>
                <Bulma.Delete
                  onClick={() => {
                    document
                      .getElementById('form-validation-error-msg')
                      .setAttribute('style', 'display: none')
                  }}
                />
              </Bulma.Message.Header>
              <Bulma.Message.Body>
                <Bulma.Content>
                  Failed to save application info. There are either missing inputs or invalid inputs
                  provided. Please check your application again.
                </Bulma.Content>
              </Bulma.Message.Body>
            </Bulma.Message>,
            document.getElementById('messages')
          )
        }
      }
    }
  }

  render () {
    return (
      <div>
        <div id='messages' />
        <form id='app-form' className='js-form'>
          <fieldset>
            <legend>
              Do you accept your invitation to hack?
            </legend>

            <div className='label'>Do you accept your invitation to hack?</div>

            <div className='field'>
              <div className='control'>
                <label
                  htmlFor='attending'
                  className={`radio tag is-medium ${
                    this.state.userApplication.attending === true
                      ? 'is-success'
                      : ''
                  } ${this.state.validInput['attending']}`}
                >
                  <input
                    id='attending'
                    type='radio'
                    value='true'
                    name='attending'
                    checked={this.state.userApplication.attending === true}
                    required
                    onChange={event =>
                      this.setState({
                        userApplication: {
                          ...this.state.userApplication,
                          attending: true
                        }
                      })
                    }
                  />
                  Accept
                </label>

                <label
                  htmlFor='not-attending'
                  className={`radio tag is-medium ${
                    this.state.userApplication.attending === false
                      ? 'is-danger'
                      : ''
                  } ${this.state.validInput['attending']}`}
                >
                  <input
                    id='not-attending'
                    type='radio'
                    value='false'
                    name='attending'
                    checked={this.state.userApplication.attending === false}
                    required
                    onChange={event =>
                      this.setState({
                        userApplication: {
                          ...this.state.userApplication,
                          attending: false
                        }
                      })
                    }
                  />
                  Decline
                </label>
              </div>
            </div>
          </fieldset>

          <div
            className={this.state.userApplication.attending === true ? '' : 'is-hidden-touch is-hidden-desktop'}
          >
            <div className='columns'>
              <div className='field column is-half'>
                <label htmlFor='firstname' className='label'>
                  First Name:
                </label>
                <div className='control'>
                  <input
                    id='firstname'
                    className={`input ${this.state.validInput['name.first']}`}
                    type='text'
                    name='firstname'
                    value={this.state.userApplication.name.first}
                    placeholder='Foo'
                    required
                    onChange={event =>
                      this.setState({
                        userApplication: {
                          ...this.state.userApplication,
                          name: { ...this.state.userApplication.name, first: event.target.value }
                        }
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='gender' className='label'>
                Gender:
              </label>
              <div className='control'>
                <div className={`select ${this.state.validInput.gender}`}>
                  <select
                    id='gender'
                    name='gender'
                    value={this.state.userApplication.gender}
                    required
                    onChange={event =>
                      this.setState({
                        userApplication: { ...this.state.userApplication, gender: event.target.value }
                      })
                    }
                    cf-questions={
                      "I hope this isn't too personal, but can you tell me your gender?&&If you wish not to say you can just choose other."
                    }
                  >
                    <option value='male' cf-label='Male'>
                      Male
                    </option>
                    <option value='female' cf-label='Female'>
                      Female
                    </option>
                    <option value='other' cf-label='Other'>
                      Other
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <fieldset>
              <legend className='label'>Select your areas of experience:</legend>

              <div className='field is-grouped is-grouped-multiline tag-selection'>
                <SkillSelection app={this} />
              </div>
            </fieldset>

            <fieldset>
              <legend style={{ display: 'none' }} >Dietary Restrictions:</legend>

              <fieldset>
                <legend className='label'>Do you have any dietary restrictions?</legend>

                <div className='field'>
                  <div className='control'>
                    <label
                      htmlFor='dietaryRestrictions-has-true'
                      className={`radio tag is-medium ${
                        this.state.userApplication.dietaryRestrictions.has === true
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['dietaryRestrictions.has']}`}
                    >
                      <input
                        id='dietaryRestrictions-has-true'
                        type='radio'
                        value='true'
                        name='dietaryRestrictions-has'
                        checked={this.state.userApplication.dietaryRestrictions.has === true}
                        required
                        onChange={event =>
                          this.setState({
                            userApplication: {
                              ...this.state.userApplication,
                              dietaryRestrictions: {
                                ...this.state.userApplication.dietaryRestrictions,
                                has: true
                              }
                            }
                          })
                        }
                      />
                      I do
                    </label>

                    <label
                      htmlFor='dietaryRestrictions-has-false'
                      className={`radio tag is-medium ${
                        this.state.userApplication.dietaryRestrictions.has === false
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['dietaryRestrictions.has']}`}
                    >
                      <input
                        id='dietaryRestrictions-has-false'
                        type='radio'
                        value='false'
                        name='dietaryRestrictions-has'
                        checked={this.state.userApplication.dietaryRestrictions.has === false}
                        required
                        onChange={event =>
                          this.setState({
                            userApplication: {
                              ...this.state.userApplication,
                              dietaryRestrictions: {
                                ...this.state.userApplication.dietaryRestrictions,
                                has: false
                              }
                            }
                          })
                        }
                      />
                      I don't
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className={`field ${this.state.userApplication.dietaryRestrictions.has === true ? '' : 'is-hidden-touch is-hidden-desktop'}`}>
                <label htmlFor='dietaryRestrictions-string' className='label'>
                  Please list your dietary restrictions:
                </label>
                <div className='control'>
                  <textarea
                    id='dietaryRestrictions-string'
                    className={`textarea ${this.state.validInput['dietaryRestrictions.string']}`}
                    name='dietaryRestrictions-string'
                    value={this.state.userApplication.dietaryRestrictions.string}
                    required
                    onChange={event =>
                      this.setState({
                        userApplication: {
                          ...this.state.userApplication,
                          dietaryRestrictions: {
                            ...this.state.userApplication.dietaryRestrictions.string,
                            string: event.target.value
                          }
                        }
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>

            <div className='field'>
              <label htmlFor='additionalComments' className='label'>
                Do you have any additional comments for us?
              </label>
              <div className='control'>
                <textarea
                  id='additionalComments'
                  className={`textarea ${this.state.validInput['additionalComments']}`}
                  name='additionalComments'
                  value={this.state.userApplication.additionalComments}
                  required
                  onChange={event =>
                    this.setState({
                      userApplication: {
                        ...this.state.userApplication,
                        additionalComments: event.target.value
                      }
                    })
                  }
                />
              </div>
            </div>

            <br />
          </div>

          <Bulma.Button
            className='button is-link'
            onClick={event => {
              event.preventDefault()
              this.submit()
            }}
          >
            Submit
          </Bulma.Button>

          {/*
          <input id='submit' type='text' value='bye' name='submit' pattern='^bye$' cf-questions={'Thanks for your info.&&We will contact you soon!&&Enter in \'bye\' to finish sign up.'}
            onChange={event => console.log(event)}
          />
          */}
        </form>
      </div>
    )
  }
}

export default Invitation
