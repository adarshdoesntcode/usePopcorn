export function Loader() {
  return <div className="loader">Loading..</div>;
}

export function ErrorMessage({ message }) {
  return <div className="error">⛔️ {message}</div>;
}
