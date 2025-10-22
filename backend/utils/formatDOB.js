
function formatDOB(currDob){
    const dob = new Date(currDob);
    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
    const year = dob.getFullYear();
    const dobPassword = `${day}${month}${year}`;
    return dobPassword;
}

module.exports = {
    formatDOB,
}