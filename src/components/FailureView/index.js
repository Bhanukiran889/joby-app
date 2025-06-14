import './index.css'

const FailureView = props => {
  const {onRetry} = props

  return (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default FailureView
