import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  LOADING: 'LOADING',
}

class JobDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.LOADING})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const formattedJobDetails = this.formatJobDetails(fetchedData.job_details)
      const formattedSimilarJobs = fetchedData.similar_jobs.map(
        this.formatJobDetails,
      )

      this.setState({
        jobDetails: formattedJobDetails,
        similarJobs: formattedSimilarJobs,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  formatJobDetails = data => ({
    id: data.id,
    title: data.title,
    rating: data.rating,
    location: data.location,
    jobDescription: data.job_description,
    employmentType: data.employment_type,
    packagePerAnnum: data.package_per_annum,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    skills: data.skills
      ? data.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        }))
      : [],
    lifeAtCompany: data.life_at_company
      ? {
          description: data.life_at_company.description,
          imageUrl: data.life_at_company.image_url,
        }
      : {},
  })

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => <FailureView onRetry={this.fetchJobDetails} />

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(skill => (
        <li key={skill.name} className="skill-item">
          <img src={skill.imageUrl} alt={skill.name} className="skill-icon" />
          <p>{skill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div className="similar-jobs">
        <h2>Similar Jobs</h2>
        <ul className="similar-jobs-list">
          {similarJobs.map(job => (
            <li key={job.id} className="similar-job-card">
              <div className="header">
                <img
                  src={job.companyLogoUrl}
                  alt="similar job company logo"
                  className="logo"
                />
                <div>
                  <h3>{job.title}</h3>
                  <p>⭐ {job.rating}</p>
                </div>
              </div>
              <p>📍 {job.location}</p>
              <p>💼 {job.employmentType}</p>
              <h4>Description</h4>
              <p>{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyLogoUrl,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="job-card">
          <div className="header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="logo"
            />
            <div>
              <h1>{title}</h1>
              <p>⭐ {rating}</p>
            </div>
          </div>

          <div className="info">
            <p>📍 {location}</p>
            <p>💼 {employmentType}</p>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description">
            <div className="desc-header">
              <h2>Description</h2>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                Visit 🔗
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>

          <div className="skills-section">
            <h2>Skills</h2>
            {this.renderSkills(skills)}
          </div>

          <div className="life-at-company">
            <h2>Life at Company</h2>
            <div className="life-content">
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
        </div>

        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderSwitch = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.LOADING:
        return this.renderLoader()
      case apiStatusConstants.SUCCESS:
        return this.renderJobDetails()
      case apiStatusConstants.FAILURE:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-route">{this.renderSwitch()}</div>
      </>
    )
  }
}

export default JobDetails
