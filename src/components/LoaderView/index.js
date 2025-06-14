import Loader from 'react-loader-spinner'
import './index.css'

const LoaderView = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
  </div>
)

export default LoaderView
