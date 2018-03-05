import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { firebaseApp } from '../firebase'
import * as Bulma from 'reactbulma'

const initialValidInputState = {
  attending: '',
  tshirtSize: '',
  'hardware.want': '',
  'hardware.list': '',
  // 'hardware.other': '',
  'dietaryRestrictions.has': '',
  'dietaryRestrictions.string': '',
  additionalComments: ''
}

function HardwareSelection (props) {
  const hardwareCollection = props.app.state.hardwareCollection
  const hardwareEl = []

  Object.keys(hardwareCollection).forEach((hardware, index) => {
    hardwareEl.push(
      <div className='control' key={index}>
        <label htmlFor={`hardware-${hardware}`} className='checkbox'>
          <input
            id={`hardware-${hardware}`}
            type='checkbox'
            value={hardware}
            name='hardware'
            checked={hardwareCollection[hardware].checked}
            onChange={event => {
              props.app.updateHardwareSelect(hardware)
              props.app.setState({ validInput: { ...props.app.state.validInput, 'hardware.list': '' } })
            }}
          />
          <span
            className={
              `tag is-rounded is-medium ` +
              (hardwareCollection[hardware].checked ? 'is-primary ' : ' ') +
              props.app.state.validInput['hardware.list']
            }
          >
            {hardwareCollection[hardware].label}
          </span>
        </label>
      </div>
    )
  })

  return hardwareEl.length > 0 ? hardwareEl : null
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
      invitation: {
        attending: null,
        tshirtSize: 'small',
        hardware: {
          want: false,
          list: ''
          // list: [],
          // other: '',
        },
        dietaryRestrictions: {
          has: false,
          string: '',
        },
        additionalComments: ''
      },
      /* hardwareCollection: {
        arduino: {
          checked: false,
          label: 'Arduino'
        },
        raspberryPi: {
          checked: false,
          label: 'Raspberry Pi'
        },
        other: {
          checked: false,
          label: 'Other'
        }
      }, */
      validInput: { ...initialValidInputState },
    }

    firebaseApp.auth().onAuthStateChanged((user) => {
      firebaseApp
        .database()
        .ref(`invitations/${user.uid}`)
        .once(
          'value',
          (snapshot) => {
            if (snapshot.val()) {
              this.setState({
                invitation: mergeDeep(Object.assign({}, this.state.invitation), snapshot.val())
              })

              /* this.state.invitation.hardware.list.forEach((hardware) => {
                this.setState({
                  hardwareCollection: {
                    ...this.state.hardwareCollection,
                    [hardware]: { ...this.state.hardwareCollection[hardware], checked: true }
                  }
                })
              }) */
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

  updateHardwareSelect (value) {
    const index = this.state.invitation.hardware.list.indexOf(value)

    if (this.state.hardwareCollection[value].checked) {
      this.state.invitation.hardware.list.splice(index, 1)

      this.setState({
        hardwareCollection: {
          ...this.state.hardwareCollection,
          [value]: { ...this.state.hardwareCollection[value], checked: false }
        }
      })
    } else {
      this.state.invitation.hardware.list.push(value)

      this.setState({
        hardwareCollection: {
          ...this.state.hardwareCollection,
          [value]: { ...this.state.hardwareCollection[value], checked: true }
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
      'additionalComments'
    ]

    if (this.state.invitation.attending === true) {
      if (this.state.invitation.hardware.want === true) {
        /* if (this.state.invitation.hardware.list.indexOf('other')) {
          optional.push('hardware.other')
        } */
      } else {
        optional.push('hardware.list')
      }

      if (this.state.invitation.dietaryRestrictions.has === false) {
        optional.push('dietaryRestrictions.string')
      }
    } else {
      optional.splice(0, 0,
        ...[
          'tshirtSize',
          'hardware.want',
          'hardware.list',
          // 'hardware.other',
          'dietaryRestrictions.has',
          'dietaryRestrictions.string'
        ]
      )
    }

    const inputs = Object.keys(this.state.validInput)
    let endValidation = false
    let index = 0
    let input = inputs[index]

    this.resetErrors()

    while (index < inputs.length && !endValidation) {
      let path = input.split('.')
      let field = this.state.invitation

      path.forEach(part => {
        field = field[part]
      })

      switch ((typeof field).toLowerCase()) {
        case 'boolean':
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
          } else if (field === null && input === 'attending') {
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
        .ref(`invitations/${user.uid}`)
        .set({
          ...this.state.invitation
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
                    <p style={{margin: 0}}>Info</p>
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
                    invitationComplete: true
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
                    <p style={{margin: 0}}>Error</p>
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
                      Failed to save invitation info. Please try again later.
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
                <p style={{margin: 0}}>Error</p>
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
                  Failed to save invitation info. There are either missing inputs or invalid inputs
                  provided. Please check your invitation again.
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
                    this.state.invitation.attending === true
                      ? 'is-success'
                      : ''
                  } ${this.state.validInput.attending}`}
                >
                  <input
                    id='attending'
                    type='radio'
                    value='true'
                    name='attending'
                    checked={this.state.invitation.attending === true}
                    required
                    onChange={event =>
                      this.setState({
                        invitation: {
                          ...this.state.invitation,
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
                    this.state.invitation.attending === false
                      ? 'is-danger'
                      : ''
                  } ${this.state.validInput.attending}`}
                >
                  <input
                    id='not-attending'
                    type='radio'
                    value='false'
                    name='attending'
                    checked={this.state.invitation.attending === false}
                    required
                    onChange={event =>
                      this.setState({
                        invitation: {
                          ...this.state.invitation,
                          attending: false
                        },
                        validInput: {
                          ...this.state.validInput,
                          attending: ''
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
            className={this.state.invitation.attending === true ? '' : 'is-hidden-touch is-hidden-desktop'}
          >
            <div className='field'>
              <label htmlFor='tshirtSize' className='label'>
                Tshirt Size:
              </label>
              <div className='control'>
                <div className={`select ${this.state.validInput.tshirtSize}`}>
                  <select
                    id='tshirtSize'
                    name='tshirtSize'
                    value={this.state.invitation.tshirtSize}
                    required
                    onChange={event =>
                      this.setState({
                        invitation: { ...this.state.invitation, tshirtSize: event.target.value }
                      })
                    }
                  >
                    <option value='small'>
                      Small
                    </option>
                    <option value='medium'>
                      Medium
                    </option>
                    <option value='large'>
                      Large
                    </option>
                    <option value='extra-large'>
                      Extra Large
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <fieldset>
              <legend style={{ display: 'none' }} >Hardware:</legend>

              <fieldset>
                <legend className='label'>Do you require any hardware?</legend>

                <div className='field'>
                  <div className='control'>
                    <label
                      htmlFor='hardware-want-true'
                      className={`radio tag is-medium ${
                        this.state.invitation.hardware.want === true
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['hardware.want']}`}
                    >
                      <input
                        id='hardware-want-true'
                        type='radio'
                        value='true'
                        name='hardware-want-true'
                        checked={this.state.invitation.hardware.want === true}
                        required
                        onChange={event =>
                          this.setState({
                            invitation: {
                              ...this.state.invitation,
                              hardware: {
                                ...this.state.invitation.hardware,
                                want: true
                              }
                            }
                          })
                        }
                      />
                      Yes
                    </label>

                    <label
                      htmlFor='hardware-want-false'
                      className={`radio tag is-medium ${
                        this.state.invitation.hardware.want === false
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['hardware.want']}`}
                    >
                      <input
                        id='hardware-want-false'
                        type='radio'
                        value='false'
                        name='hardware-want'
                        checked={this.state.invitation.hardware.want === false}
                        required
                        onChange={event =>
                          this.setState({
                            invitation: {
                              ...this.state.invitation,
                              hardware: {
                                ...this.state.invitation.hardware,
                                want: false
                              }
                            }
                          })
                        }
                      />
                      No
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className={`columns ${this.state.invitation.hardware.want === true ? '' : 'is-hidden-touch is-hidden-desktop'}`}>
                <div className='field column is-half'>
                  <label htmlFor='hardware-list' className='label'>
                    List hardware you would like:
                  </label>
                  <div className='control'>
                    <input
                      id='hardware-list'
                      className={`input ${this.state.validInput['hardware.list']}`}
                      type='text'
                      name='hardware-list'
                      value={this.state.invitation.hardware.list}
                      placeholder='Arduino, Raspberry Pi, etc.'
                      required
                      onChange={event =>
                        this.setState({
                          invitation: {
                            ...this.state.invitation,
                            hardware: {
                              ...this.state.invitation.hardware,
                              list: event.target.value
                            }
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/*
                <fieldset className={`field ${this.state.invitation.hardware.want === true ? '' : 'is-hidden-touch is-hidden-desktop'}`}>
                  <legend className='label'>Select the hardware you require:</legend>

                  <div className='field is-grouped is-grouped-multiline tag-selection'>
                    <HardwareSelection app={this} />
                  </div>
                </fieldset>
              */}

              {/*
              <div className={`columns ${this.state.invitation.hardware.list.indexOf('other') > -1 ? '' : 'is-hidden-touch is-hidden-desktop'}`}>
                <div className='field column is-half'>
                  <label htmlFor='hardware-other' className='label'>
                    List other hardware you would like:
                  </label>
                  <div className='control'>
                    <input
                      id='hardware-other'
                      className={`input ${this.state.validInput['hardware.other']}`}
                      type='text'
                      name='hardware-other'
                      value={this.state.invitation.hardware.other}
                      placeholder='Arduino, Raspberry Pi, etc.'
                      required
                      onChange={event =>
                        this.setState({
                          invitation: {
                            ...this.state.invitation,
                            hardware: {
                              ...this.state.invitation.hardware,
                              other: event.target.value
                            }
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              */}
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
                        this.state.invitation.dietaryRestrictions.has === true
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['dietaryRestrictions.has']}`}
                    >
                      <input
                        id='dietaryRestrictions-has-true'
                        type='radio'
                        value='true'
                        name='dietaryRestrictions-has'
                        checked={this.state.invitation.dietaryRestrictions.has === true}
                        required
                        onChange={event =>
                          this.setState({
                            invitation: {
                              ...this.state.invitation,
                              dietaryRestrictions: {
                                ...this.state.invitation.dietaryRestrictions,
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
                        this.state.invitation.dietaryRestrictions.has === false
                          ? 'is-primary'
                          : ''
                      } ${this.state.validInput['dietaryRestrictions.has']}`}
                    >
                      <input
                        id='dietaryRestrictions-has-false'
                        type='radio'
                        value='false'
                        name='dietaryRestrictions-has'
                        checked={this.state.invitation.dietaryRestrictions.has === false}
                        required
                        onChange={event =>
                          this.setState({
                            invitation: {
                              ...this.state.invitation,
                              dietaryRestrictions: {
                                ...this.state.invitation.dietaryRestrictions,
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

              <div className={`field ${this.state.invitation.dietaryRestrictions.has === true ? '' : 'is-hidden-touch is-hidden-desktop'}`}>
                <label htmlFor='dietaryRestrictions-string' className='label'>
                  Please list your dietary restrictions:
                </label>
                <div className='control'>
                  <textarea
                    id='dietaryRestrictions-string'
                    className={`textarea ${this.state.validInput['dietaryRestrictions.string']}`}
                    name='dietaryRestrictions-string'
                    value={this.state.invitation.dietaryRestrictions.string}
                    required
                    onChange={event =>
                      this.setState({
                        invitation: {
                          ...this.state.invitation,
                          dietaryRestrictions: {
                            ...this.state.invitation.dietaryRestrictions,
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
                  value={this.state.invitation.additionalComments}
                  required
                  onChange={event =>
                    this.setState({
                      invitation: {
                        ...this.state.invitation,
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
