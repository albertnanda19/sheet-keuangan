export const styles = {
  card: "bg-white rounded-xl border border-gray-200 shadow-sm",
  cardHover: "bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md",
  btnPrimary: "bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  btnSecondary: "bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  btnDanger: "bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 active:bg-red-700 transition-colors",
  btnSuccess: "bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors",
  input: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500",
  label: "block text-sm font-medium text-gray-700 mb-1",
} as const;
