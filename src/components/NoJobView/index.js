import './index.css'

const NoJobsView = () => (
  <div className="no-jobs-view">
    <img
      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      alt="no jobs"
      className="no-jobs-img"
    />
    <h1>No Jobs Found</h1>
    <p>We could not find any jobs. Try other filters.</p>
  </div>
)

export default NoJobsView
