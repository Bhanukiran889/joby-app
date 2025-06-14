import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {withRouter} from 'react-router-dom'
import Header from '../Header'
import FailureView from '../FailureView'
import './index.css'

import {employmentTypesList, salaryRangesList} from '../../utils/constants'

const apiStatus = {
  INITIAL: 'INITIAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  LOADING: 'LOADING',
}

class Jobs extends Component {
  state = {
    profile: {},
    jobsList: [],
    selectedEmploymentTypes: [],
    selectedSalary: '',
    searchInput: '',
    profileStatus: apiStatus.INITIAL,
    jobsStatus: apiStatus.INITIAL,
  }

  componentDidMount() {
    this.fetchProfile()
    this.fetchJobs()
  }

  fetchProfile = async () => {
    this.setState({profileStatus: apiStatus.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedProfile = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({profile: updatedProfile, profileStatus: apiStatus.SUCCESS})
    } else {
      this.setState({profileStatus: apiStatus.FAILURE})
    }
  }

  fetchJobs = async () => {
    this.setState({jobsStatus: apiStatus.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const {selectedEmploymentTypes, selectedSalary, searchInput} = this.state

    const employmentParam = selectedEmploymentTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentParam}&minimum_package=${selectedSalary}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const jobsList = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        location: job.location,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        companyLogoUrl: job.company_logo_url,
        jobDescription: job.job_description,
      }))
      this.setState({jobsList, jobsStatus: apiStatus.SUCCESS})
    } else {
      this.setState({jobsStatus: apiStatus.FAILURE})
    }
  }

  handleEmploymentTypeChange = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const updatedTypes = checked
        ? [...prevState.selectedEmploymentTypes, value]
        : prevState.selectedEmploymentTypes.filter(type => type !== value)
      return {selectedEmploymentTypes: updatedTypes}
    }, this.fetchJobs)
  }

  handleSalaryChange = event => {
    this.setState({selectedSalary: event.target.value}, this.fetchJobs)
  }

  handleSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  handleSearch = () => {
    this.fetchJobs()
  }

  handleEnterKey = event => {
    if (event.key === 'Enter') {
      this.fetchJobs()
    }
  }

  renderProfile = () => {
    const {profile} = this.state
    return (
      <div className="profile-card">
        <img src={profile.profileImageUrl} alt="profile" />
        <h1>{profile.name}</h1>
        <p>{profile.shortBio}</p>
      </div>
    )
  }

  renderProfileSection = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatus.LOADING:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
          </div>
        )
      case apiStatus.SUCCESS:
        return this.renderProfile()
      case apiStatus.FAILURE:
        return <FailureView onRetry={this.fetchProfile} />
      default:
        return null
    }
  }

  renderFilters = () => (
    <div className="filters">
      <h2>Type of Employment</h2>
      <ul>
        {employmentTypesList.map(item => (
          <li key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              value={item.employmentTypeId}
              onChange={this.handleEmploymentTypeChange}
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </li>
        ))}
      </ul>

      <h2>Salary Range</h2>
      <ul>
        {salaryRangesList.map(item => (
          <li key={item.salaryRangeId}>
            <input
              type="radio"
              name="salary"
              id={item.salaryRangeId}
              value={item.salaryRangeId}
              onChange={this.handleSalaryChange}
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    const {history} = this.props
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li
            key={job.id}
            className="job-card"
            onClick={() => history.push(`/jobs/${job.id}`)}
          >
            <div className="job-header">
              <img src={job.companyLogoUrl} alt="company logo" />
              <div>
                <h3>{job.title}</h3>
                <p>⭐ {job.rating}</p>
              </div>
            </div>
            <p>📍 {job.location}</p>
            <p>💼 {job.employmentType}</p>
            <p className="package">{job.packagePerAnnum}</p>
            <h4>Description</h4>
            <p>{job.jobDescription}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatus.LOADING:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
          </div>
        )
      case apiStatus.SUCCESS:
        return this.renderJobsList()
      case apiStatus.FAILURE:
        return <FailureView onRetry={this.fetchJobs} />
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-route-container">
          <div className="sidebar">
            {this.renderProfileSection()}
            {this.renderFilters()}
          </div>

          <div className="main-content">
            <div className="search-bar">
              <input
                type="search"
                value={searchInput}
                onChange={this.handleSearchInputChange}
                onKeyDown={this.handleEnterKey}
                placeholder="Search"
              />
              <button
                type="button"
                onClick={this.handleSearch}
                data-testid="searchButton"
              >
                🔍
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Jobs)
