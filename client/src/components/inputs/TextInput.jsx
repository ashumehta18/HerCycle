export default function TextInput({ label, type = 'text', value, onChange, placeholder, error, autoComplete }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={
          `w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 ` +
          (error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300 dark:border-gray-700')
        }
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
