import { CgSpinner } from 'react-icons/cg'

import AppColors from '/src/constants/AppColors'

export default function Loading({ isLoading }) {
  if (!isLoading) {
    return null
  }
  return (
    <div className="absolute top-0 left-0 z-50 h-full w-full h-center bg-[#f26e4211]">
      <div className="animate-spin">
        <CgSpinner size={50} color={AppColors.text} />
      </div>
    </div>
  )
}
