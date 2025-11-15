function formatDOB(date) {
  // Convert date to DDMMYYYY format
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = d.getFullYear();
  return `${day}${month}${year}`;
}

module.exports = { formatDOB };