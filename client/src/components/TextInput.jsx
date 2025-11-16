import _ from 'lodash'
import { useState } from 'react'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'

export default function TextInput({
  id,
  name,
  placeholder = '',
  label,
  value,
  onChange = _.noop,
  onBlur = _.noop,
  type = 'text',
  style = {},
  error = false,
  errorMsg = 'Field is Invalid',
  leadingIcon,
  trailingIcon,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const drawInput = () => {
    let trailPadding = 10
    if (type == 'password' && trailingIcon != null) {
      trailPadding = 80
    } else if (type == 'password' || trailingIcon != null) {
      trailPadding = 40
    }
    return (
      <span className="w-full h-full relative">
        {leadingIcon && (
          <span className="h-full w-[40px] h-center absolute left-0 top-0">
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          style={{
            paddingLeft: leadingIcon == null ? 10 : 40,
            paddingRight: trailPadding,
            ...style,
          }}
          className="text-[13px] font-[300] h-full w-full focus:outline-none focus:ring-2 ring-[#f26e4288] rounded-sm"
        />
        {trailingIcon && (
          <span
            style={{ right: trailPadding - 40 }}
            className="h-full w-[40px] h-center absolute top-0"
          >
            {trailingIcon}
          </span>
        )}
        {type == 'password' && (
          <span
            className="h-full w-[40px] h-center absolute right-0 top-0"
            onClick={() => {
              setShowPassword(!showPassword)
            }}
          >
            {showPassword ? <VscEyeClosed /> : <VscEye />}
          </span>
        )}
      </span>
    )
  }

  return (
    <div style={style} className="flex flex-col">
      {label != null && (
        <label
          htmlFor={id}
          className="text-sm font-sans pb-1 pl-1 font-normal text-app-dark"
        >
          {label}
        </label>
      )}
      {error ? (
        <span className="w-full relative ring-1 ring-rose-300 h-[40px] rounded-sm h-center">
          {drawInput()}
        </span>
      ) : (
        <span className="w-full relative ring-1 ring-gray-300 h-[40px] rounded-sm h-center">
          {drawInput()}
        </span>
      )}
      {error && (
        <p className="text-rose-400 text-xs font-light pt-1">{errorMsg}</p>
      )}
    </div>
  )
}
