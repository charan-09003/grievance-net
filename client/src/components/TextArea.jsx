import _ from 'lodash'
import { GrNotes } from 'react-icons/gr'

export default function TextArea({
  id,
  name,
  placeholder = '',
  label,
  value,
  onChange = _.noop,
  onBlur = _.noop,
  style = {},
  error = false,
  rows = '10',
  errorMsg = 'Field is Invalid',
}) {
  const drawInput = () => {
    return (
      <textarea
        id={id}
        rows={rows}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          ...style,
        }}
        className="text-[13px] p-2 m-0 font-[300] h-full w-full focus:outline-none focus:ring-2 ring-[#f26e4288] rounded-sm"
      ></textarea>
    )
  }

  return (
    <div style={style} className="flex flex-col">
      {label != null && (
        <div className="flex justify-start items-center mb-2">
          <label
            htmlFor={id}
            className="text-sm font-sans font-normal text-app-dark mr-2"
          >
            {label}
          </label>
          <GrNotes />
        </div>
      )}
      {error ? (
        <span className="w-full relative p-0 ring-1 ring-rose-300 rounded-sm h-center">
          {drawInput()}
        </span>
      ) : (
        <span className="w-full relative p-0 ring-1 ring-gray-300 rounded-sm h-center">
          {drawInput()}
        </span>
      )}
      {error && (
        <p className="text-rose-400 text-xs font-light pt-1">{errorMsg}</p>
      )}
    </div>
  )
}
