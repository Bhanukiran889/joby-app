import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showError: true})
  }

  handleSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-card">
          <img
            className="logo-img"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="pas">
            <p>username: rahul</p>
            <p>password: rahul@2021</p>
            <p />
          </div>
          <form className="form" onSubmit={this.handleSubmit}>
            <label htmlFor="username">USERNAME</label>
            <input
              className="login-input"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={this.handleChange}
              placeholder="Username"
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              placeholder="Password"
            />

            <button className="login-btn" type="submit">
              Login
            </button>

            <p className={`error-msg ${showError ? '' : 'hiden'}`}>
              *{errorMsg}
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
